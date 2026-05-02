export type Organization = {
  id: number;
  name: string;
  domain: string;
  employees: number;
  scope: string;
  description: string;
  technology_environment: string;
  business_processes: string;
  security_objectives: string;
};

export type Asset = {
  id: number;
  name: string;
  category: string;
  owner_department: string;
  confidentiality_level: string;
  integrity_level: string;
  availability_level: string;
  business_value: string;
  description: string;
};

export type Threat = {
  id: number;
  asset_id: number;
  asset_name?: string;
  vulnerability: string;
  threat: string;
  consequence: string;
  mitigation: string;
};

export type Risk = {
  id: number;
  asset_id: number;
  asset_name?: string;
  vulnerability: string;
  threat: string;
  description: string;
  tp: number;
  vl: number;
  sev: number;
  det: number;
  risk_score: number;
  risk_level: string;
  recommended_control: string;
  residual_risk: string;
  priority: string;
  control_type: string;
  control_function: string;
  implementation_steps: string;
};

export type QuantitativeRisk = {
  id: number;
  asset_name: string;
  threat: string;
  asset_value: number;
  exposure_factor: number;
  sle: number;
  aro: number;
  ale: number;
  recommendation: string;
};

export type Control = {
  id: number;
  name: string;
  control_type: string;
  control_function: string;
  description: string;
  implementation_status: string;
  responsible_department: string;
  related_risks: string;
};

export type Policy = {
  id: number;
  title: string;
  purpose: string;
  scope: string;
  roles: string;
  policy_statements: string;
  procedure: string;
  monitoring: string;
  review_frequency: string;
};

export type ChecklistQuestion = {
  id: number;
  standard: string;
  section: string;
  question: string;
  order_number: number;
};
