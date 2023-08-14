[
  (do_while_statement)
  (while_statement)
  (if_statement)
  (for_statement)
  (function_definition)
  (class_definition)
] @scope

(variable_declaration
  name: (identifier) @definition.var)

((class_definition
   name: (identifier) @definition.class)
   (#set! definition.class.scope "parent"))

((function_definition
  name: (identifier) @definition.function)
  (#set! definition.function.scope "parent"))

(parameter_list (identifier) @definition.parameter)

[
  (identifier)
] @reference
