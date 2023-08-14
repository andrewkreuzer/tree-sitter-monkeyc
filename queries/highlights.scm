"return" @keyword.return

(break_statement) @keyword
(identifier) @variable

(while_statement
[
  "while"
] @repeat)

(do_while_statement
[
  "while"
  "do"
] @repeat)

(if_statement
[
  "if"
  "else"
] @conditional)

(for_statement
[
  "for"
] @repeat)

(function_definition
[
  "function"
] @keyword.function)

;; Operators

[
 "or"
] @keyword.operator

[
 "+"
 "-"
 "*"
 "/"
 "%"
 "<"
 ">"
 "=="
 "<="
 ">="
 "!="
 "&&"
 "||"
 "++"
 "--"
 "+="
 "-="
 "*="
 "/="
 "%="
 "<<="
 ">>="
 "&="
 "|="
 "^="
 "or"
 ] @operator

(using_statement
  "using" @include
  [
   (identifier) @include
  (property_access
    object: (identifier) @include
    property: (identifier) @include)
  ])

(class_definition
  "class" @keyword
  name: (identifier) @type
  (extends_clause 
    "extends" @keyword
    (_)) @type)

(function_definition
  (object_keyword) @keyword
  name: (identifier) @function)

(function_call
  function: (identifier) @function.call)

(property_access
  object: (_) @method.call
  "." @operator
  property: (identifier) @method.call)

(parameter_list
  (identifier) @lsp.type.parameter)

(array_type
  [
   "Lang.Array"
   "Array"
   "Toybox.Lang.Array"
  ] @method
  (identifier) @type)

(dictionary_type
  [
   "Lang.Dictionary"
   "Dictionary"
   "Toybox.Lang.Dictionary"
  ] @method
  (identifier) @type
  "," @operator
  (identifier) @type)

[
  "typedef"
  "private"
  "public"
  "function"
  "try"
  "catch"
  "finally"
  "throw"
  "var"
  "const"
  "new"
  "if"
  "do"
  "while"
  "for"
  "continue"
  "break"
  "enum"
] @keyword

[
 "instanceof"
 "has"
 "or"
] @keyword.operator

(type_identifier
  "as" @keyword
  type: (_) @type.namespace)

"return" @keyword.return

(number_literal) @number
(string_literal) @string @spell
(boolean_literal) @boolean
(global_namespace) @field
(nullable) @function
(symbol) @keyword
(unary_expression) @type
(comment) @comment
