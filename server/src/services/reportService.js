const { db } = require('../db/database');

function tableMarkdown(headers, rows) {
  const header = `| ${headers.join(' | ')} |`;
  const divider = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? '').replace(/\n/g, '<br>').replace(/\|/g, '\\|')).join(' | ')} |`);
  return [header, divider, ...body].join('\n');
}

function list(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function formatThreatItems(value) {
  return String(value || '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
    .join('<br>');
}

function buildAssetThreatTable(category, assets, threats) {
  const rows = assets
    .filter((asset) => asset.category === category)
    .map((asset) => {
      const related = threats.filter((threat) => threat.asset_id === asset.id);
      const threatText = related.map((item) => `уязвимость: ${item.vulnerability}; угроза: ${item.threat}; последствие: ${item.consequence}`).join('<br><br>');
      const mitigationText = related.map((item) => item.mitigation).join('<br>');
      return [asset.name, threatText || 'Риск не выявлен в учебном наборе данных', mitigationText || 'Периодический пересмотр и базовые меры защиты'];
    });

  return `### ${category}\n\n${tableMarkdown(['Активы', 'Угрозы', 'Меры снижения риска'], rows)}\n`;
}

function buildReport() {
  const org = db.prepare('SELECT * FROM organizations LIMIT 1').get();
  const departments = db.prepare('SELECT name, description FROM departments ORDER BY id').all();
  const assets = db.prepare('SELECT * FROM assets ORDER BY id').all();
  const threats = db.prepare('SELECT threats.*, assets.name AS asset_name, assets.category AS asset_category FROM threats JOIN assets ON assets.id = threats.asset_id ORDER BY threats.id').all();
  const risks = db.prepare('SELECT risks.*, assets.name AS asset_name FROM risks JOIN assets ON assets.id = risks.asset_id ORDER BY risks.risk_score DESC').all();
  const quantitative = db.prepare('SELECT * FROM quantitative_risks ORDER BY ale DESC').all();
  const controls = db.prepare('SELECT * FROM controls ORDER BY control_type, control_function, id').all();
  const policies = db.prepare('SELECT * FROM policies ORDER BY id').all();

  const totalAle = quantitative.reduce((sum, row) => sum + Number(row.ale || 0), 0);
  const categories = ['Информация / данные', 'Программное обеспечение', 'Аппаратное обеспечение', 'Сеть'];

  return `# Lab Report - Document Enterprise Cybersecurity Issues

## Система менеджмента информационной безопасности для ООО «MediNova Clinic»

**Дисциплина:** Информационная безопасность  
**Стандарты:** ISO 27001, ISO 27005  
**Организация:** ${org.name} / ООО «MediNova Clinic»  
**Тип работы:** учебная симуляция ISMS, не инструмент реальной сертификации

---

## Objectives

Part 1: Зафиксировать оценку проблем кибербезопасности выбранной организации.  
Part 2: Определить основные типы активов, которыми владеет организация.  
Part 3: Перечислить угрозы для каждого типа активов.  
Part 4: Предложить методы снижения риска для каждой угрозы.  

Дополнительно в работе показаны элементы ISO 27001 и ISO 27005: область применения ISMS, реестр рисков, качественная и количественная оценка рисков, контроли безопасности, политики и итоговый план внедрения.

---

## Scenario

ООО «MediNova Clinic» — частная медицинская клиника и диагностический центр. Организация обслуживает пациентов, ведет электронные медицинские карты, обрабатывает лабораторные результаты, финансовую и страховую документацию, а также персональные данные сотрудников.

В клинике работает около ${org.employees} сотрудников. Основные подразделения включают руководство, IT-отдел, медицинский персонал, диагностическую лабораторию, регистратуру / Call Center, финансовый отдел, HR, юридический отдел и физическую охрану.

Критические бизнес-процессы:

${list(formatThreatItems(org.business_processes).split('<br>'))}

Технологическая среда:

${list(formatThreatItems(org.technology_environment).split('<br>'))}

Клиника должна обеспечивать конфиденциальность медицинских и персональных данных, целостность медицинских записей и доступность критических сервисов. Для этого в проекте моделируется система менеджмента информационной безопасности на основе подходов ISO 27001 и ISO 27005.

---

## Instructions

На основе сценария необходимо определить активы, угрозы и меры защиты. Для удобства активы разделены на четыре категории:

- Information/Data Assets — данные, которые используются, хранятся или передаются организацией.
- Software Assets — операционные системы, серверное ПО, базы данных, пользовательские и корпоративные приложения.
- Physical Assets — физические устройства, серверы, рабочие станции, камеры, считыватели и другое оборудование.
- Network Assets — сети, сетевые сервисы, VPN, Wi-Fi, firewall, интернет-канал.

---

## Part 1: Record the assessment of cybersecurity issues

### 1.1 Описание организации

${org.description}

**Область применения ISMS:**  
${org.scope}

**Цели безопасности:**  
${org.security_objectives}

### 1.2 Подразделения организации

${tableMarkdown(['Подразделение', 'Описание'], departments.map((department) => [department.name, department.description]))}

### 1.3 Основные проблемы кибербезопасности

${tableMarkdown(
  ['Проблема', 'Описание', 'Возможное влияние'],
  [
    ['Защита медицинских данных', 'Клиника хранит персональные данные пациентов, электронные медицинские карты и лабораторные результаты.', 'Утечка данных, нарушение конфиденциальности, репутационный ущерб.'],
    ['Доступность медицинских сервисов', 'Регистрация пациентов, запись на прием и доступ врачей к медицинским данным зависят от IT-инфраструктуры.', 'Простой клиники, задержка медицинских услуг, финансовые потери.'],
    ['Удаленный доступ', 'Врачи и администраторы используют VPN и удаленный доступ к внутренним системам.', 'Компрометация учетных записей, несанкционированный доступ.'],
    ['Резервное копирование', 'Медицинские данные должны быть восстановимы после ransomware, сбоя или ошибки.', 'Потеря данных и невозможность продолжать работу.'],
    ['Физическая безопасность', 'Серверы, CCTV и система контроля доступа должны быть защищены от физического воздействия.', 'Кража оборудования, повреждение инфраструктуры, нарушение доступности.']
  ]
)}

---

## Part 2: Record the different types of assets

${categories.map((category) => {
  const rows = assets
    .filter((asset) => asset.category === category)
    .map((asset) => [asset.name, asset.owner_department, asset.confidentiality_level, asset.integrity_level, asset.availability_level, asset.business_value]);
  return `### ${category}\n\n${tableMarkdown(['Актив', 'Владелец / отдел', 'Конфиденциальность', 'Целостность', 'Доступность', 'Бизнес-ценность'], rows)}`;
}).join('\n\n')}

---

## Part 3: List the threats for each asset type

### Вопрос

**В чем разница между угрозой и уязвимостью?**

Уязвимость — это слабое место актива, процесса или контроля, которое может быть использовано. Угроза — это возможное событие или действие, которое использует уязвимость и приводит к ущербу. Например, слабый пароль является уязвимостью, а кража учетных данных — угрозой.

${categories.map((category) => buildAssetThreatTable(category, assets, threats)).join('\n')}

---

## Part 4: Recommend mitigation techniques

Для снижения рисков предложены физические, технические и административные контроли. Они разделяются по функции: предупреждающие, обнаруживающие и корректирующие.

${tableMarkdown(
  ['Тип контроля', 'Функция', 'Контроль', 'Статус', 'Ответственный отдел', 'Связанный риск'],
  controls.map((control) => [
    control.control_type,
    control.control_function,
    control.name,
    control.implementation_status,
    control.responsible_department,
    control.related_risks
  ])
)}

---

## ISO 27005 Risk Assessment

Для оценки риска используется учебная модель TP/VL/SEV/DET:

- TP — вероятность угрозы.
- VL — уровень уязвимости.
- SEV — серьезность / влияние на бизнес.
- DET — возможность обнаружения.

Формула:

\`\`\`text
risk = round((((TP - 1) + (VL - 1) + (SEV - 1) + (5 - DET)) / 16) × 100)
\`\`\`

Чем выше TP, VL и SEV, тем выше риск. Чем выше DET, тем ниже риск, потому что событие легче обнаружить.

${tableMarkdown(
  ['ID', 'Актив', 'Уязвимость', 'Угроза', 'TP', 'VL', 'SEV', 'DET', 'Риск %', 'Уровень', 'Совет'],
  risks.map((risk) => [
    risk.id,
    risk.asset_name,
    risk.vulnerability,
    risk.threat,
    risk.tp,
    risk.vl,
    risk.sev,
    risk.det,
    risk.risk_score,
    risk.risk_level,
    risk.recommended_control
  ])
)}

---

## Quantitative Risk Analysis

Для количественной оценки используются показатели:

\`\`\`text
SLE = Asset Value × Exposure Factor
ALE = SLE × ARO
\`\`\`

Общий ожидаемый годовой ущерб по учебным сценариям: **${totalAle.toFixed(2)} EUR**.

${tableMarkdown(
  ['Актив', 'Угроза', 'Стоимость актива', 'Exposure Factor', 'SLE', 'ARO', 'ALE', 'Рекомендация'],
  quantitative.map((risk) => [
    risk.asset_name,
    risk.threat,
    risk.asset_value,
    risk.exposure_factor,
    risk.sle,
    risk.aro,
    risk.ale,
    risk.recommendation
  ])
)}

---

## Security Policies

${tableMarkdown(
  ['Политика', 'Цель', 'Область применения', 'Периодичность пересмотра'],
  policies.map((policy) => [policy.title, policy.purpose, policy.scope, policy.review_frequency])
)}

---

## Reflection

### 1. Почему полезно категоризировать активы при определении угроз и мер защиты?

Категоризация активов помогает структурировать анализ. Для данных, программного обеспечения, оборудования и сетей характерны разные угрозы и разные меры защиты. Такой подход уменьшает вероятность пропустить важный актив и облегчает выбор контролей.

### 2. Могут ли разные угрозы иметь одинаковые или похожие меры снижения риска?

Да. Например, MFA снижает риск кражи учетных данных для VPN, почты и внутренних систем. Резервное копирование помогает при ransomware, ошибках персонала и сбоях оборудования. Это важно учитывать, потому что один хорошо внедренный контроль может снижать сразу несколько рисков.

### 3. Что показывает применение знаний о киберугрозах к смоделированной организации?

Проект показывает, что защита организации требует комплекса мер. Нельзя ограничиться одним firewall или одной политикой. Для MediNova Clinic нужны технические, административные и физические контроли, регулярная оценка рисков, обучение персонала, резервное копирование, мониторинг и план реагирования на инциденты.

---

## Conclusion

В результате была разработана учебная модель ISMS для ООО «MediNova Clinic». Отчет демонстрирует полный цикл анализа: описание организации, определение активов, угроз и уязвимостей, оценку рисков по ISO 27005, выбор контролей, разработку политик и формирование рекомендаций. Для реальной сертификации ISO 27001 потребовались бы официальный аудит, доказательства внедрения, юридическая проверка и регулярное измерение эффективности контролей.

End of document
`;
}

module.exports = { buildReport, tableMarkdown };
