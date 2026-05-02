const { db } = require('../db/database');

function tableMarkdown(headers, rows) {
  const header = `| ${headers.join(' | ')} |`;
  const divider = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? '').replace(/\n/g, '<br>')).join(' | ')} |`);
  return [header, divider, ...body].join('\n');
}

function buildReport() {
  const org = db.prepare('SELECT * FROM organizations LIMIT 1').get();
  const departments = db.prepare('SELECT name, description FROM departments ORDER BY id').all();
  const assets = db.prepare('SELECT * FROM assets ORDER BY id').all();
  const threats = db.prepare(`SELECT threats.*, assets.name AS asset_name FROM threats JOIN assets ON assets.id = threats.asset_id ORDER BY threats.id`).all();
  const risks = db.prepare(`SELECT risks.*, assets.name AS asset_name FROM risks JOIN assets ON assets.id = risks.asset_id ORDER BY risks.risk_score DESC`).all();
  const quantitative = db.prepare('SELECT * FROM quantitative_risks ORDER BY ale DESC').all();
  const controls = db.prepare('SELECT * FROM controls ORDER BY control_type, control_function, id').all();
  const policies = db.prepare('SELECT * FROM policies ORDER BY id').all();

  const totalAle = quantitative.reduce((sum, row) => sum + Number(row.ale || 0), 0);

  return `# Система менеджмента информационной безопасности для ООО «MediNova Clinic»

## 1. Введение

Данный учебный проект описывает модель системы менеджмента информационной безопасности для частной медицинской клиники. Работа основана на идеях ISO 27001 и ISO 27005: определение области применения, инвентаризация активов, анализ угроз, оценка рисков, выбор контролей и подготовка политик. Проект не является инструментом сертификации, а предназначен для демонстрации методики на защите.

## 2. Описание организации

${org.description}

- Название: ${org.name}
- Сфера деятельности: ${org.domain}
- Количество сотрудников: ${org.employees}
- Цели безопасности: ${org.security_objectives}

### Подразделения

${tableMarkdown(['Подразделение', 'Описание'], departments.map((d) => [d.name, d.description]))}

## 3. Область применения ISMS

${org.scope}

## 4. Важные информационные активы

${tableMarkdown(['ID', 'Актив', 'Категория', 'Владелец', 'К', 'Ц', 'Д', 'Ценность'], assets.map((a) => [a.id, a.name, a.category, a.owner_department, a.confidentiality_level, a.integrity_level, a.availability_level, a.business_value]))}

## 5. Угрозы и уязвимости

${tableMarkdown(['Актив', 'Уязвимость', 'Угроза', 'Последствие', 'Мера снижения'], threats.map((t) => [t.asset_name, t.vulnerability, t.threat, t.consequence, t.mitigation]))}

## 6. Методология оценки рисков

Для качественной оценки ISO 27005 используется учебная модель TP/VL/SEV/DET. TP отражает вероятность угрозы, VL — уровень уязвимости, SEV — влияние на бизнес, DET — возможность обнаружения. Чем выше DET, тем ниже итоговый риск, потому что событие легче выявить и остановить.

Формула: риск = round((((TP - 1) + (VL - 1) + (SEV - 1) + (5 - DET)) / 16) × 100).

## 7. Реестр рисков

${tableMarkdown(['ID', 'Актив', 'Уязвимость', 'Угроза', 'TP', 'VL', 'SEV', 'DET', 'Риск %', 'Уровень', 'Контроль'], risks.map((r) => [r.id, r.asset_name, r.vulnerability, r.threat, r.tp, r.vl, r.sev, r.det, r.risk_score, r.risk_level, r.recommended_control]))}

## 8. Количественная оценка рисков

SLE = стоимость актива × Exposure Factor. ALE = SLE × ARO. Общий ожидаемый годовой ущерб: ${totalAle.toFixed(2)} EUR.

${tableMarkdown(['Актив', 'Угроза', 'Стоимость', 'EF', 'SLE', 'ARO', 'ALE', 'Рекомендация'], quantitative.map((q) => [q.asset_name, q.threat, q.asset_value, q.exposure_factor, q.sle, q.aro, q.ale, q.recommendation]))}

## 9. Качественная оценка рисков

Качественная матрица 5×5 сопоставляет вероятность и влияние. Результаты группируются как незначительные, умеренные, существенные и критические. Метод удобен для защиты и первичной приоритизации, но требует экспертного подтверждения.

## 10. Контроли информационной безопасности

${tableMarkdown(['Название', 'Тип', 'Функция', 'Статус', 'Ответственный отдел'], controls.map((c) => [c.name, c.control_type, c.control_function, c.implementation_status, c.responsible_department]))}

## 11. Политика информационной безопасности

${tableMarkdown(['Политика', 'Цель', 'Периодичность пересмотра'], policies.map((p) => [p.title, p.purpose, p.review_frequency]))}

## 12. Процедуры безопасности

Процедуры включают управление доступом, резервное копирование, реагирование на инциденты, удалённый доступ, обновления, шифрование и мониторинг. Каждая процедура имеет владельца, шаги выполнения и механизм контроля.

## 13. План внедрения

1. Утвердить область применения ISMS и владельцев активов.
2. Завершить классификацию активов и пересмотр прав доступа.
3. Внедрить MFA для VPN, почты и административных учетных записей.
4. Настроить централизованное логирование и регулярный анализ событий.
5. Проверять резервное восстановление ежемесячно.
6. Провести обучение персонала и phishing simulation.
7. Провести внутренний аудит и обновить план обработки рисков.

## 14. Заключение

Разработанная система показывает полный учебный цикл ISMS: организация, активы, угрозы, риски, контроли, политики и отчетность. Для реальной сертификации потребовались бы официальный аудит, доказательства внедрения, юридическая проверка и регулярные измерения эффективности.
`;
}

module.exports = { buildReport, tableMarkdown };
