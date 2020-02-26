

export enum ConstructKind {
  ConditionConstruct = 'CONDITION_CONSTRUCT',
  InstructionConstruct = 'INSTRUCTION',
  QuestionConstruct = 'QUESTION_CONSTRUCT',
  SequenceConstruct= 'SEQUENCE_CONSTRUCT',
  StatementConstruct= 'STATEMENT_CONSTRUCT'
}

export enum ConstructIconKind {
  ConditionConstruct = 'low_priority',
  InstructionConstruct = 'speaker_notes',
  QuestionConstruct = 'help_outline',
  SequenceConstruct= 'view_list',
  StatementConstruct= 'record_voice_over'
}
