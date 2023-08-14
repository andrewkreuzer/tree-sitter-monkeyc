const PREC = {
}

module.exports = grammar({
  name: 'monkeyc',

  extras: $ => [
    /\s|\\\r?\n/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.using_statement,
      $._expression_statement,
      $.block_statement,
      $.class_definition,
      // $.class_member,
      $.variable_declaration,
      $.variable_assignment,
      $.variable_type_assignment,
      $.constant_declaration,
      $.if_statement,
      $.while_statement,
      $.do_while_statement,
      $.for_statement,
      $.switch_case_statement,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.empty_statement,
      $.function_definition,
      $.enum_definition,
      $.try_catch_statement,
      $.throw_statement,
      $.type_definition,
    ),

    using_statement: $ => seq(
      'using',
      field('import', $._expression),
      ';'
    ),

    _expression_statement: $ => seq(
      $._expression,
      ';'
    ),

    block_statement: $ => prec.right(1, seq(
      '{',
      repeat($._statement),
      '}'
    )),

    class_definition: $ => seq(
      'class',
      field('name', $.identifier),
      optional($.extends_clause),
      field('body', $.block_statement),
    ),

    extends_clause: $ => seq(
      'extends',
      $._expression,
    ),

    // TODO: class_block?
    //       with a different set of possible _expressions
    class_member: $ => seq(
      optional($.object_keyword),
      'var',
      field('name', $.identifier),
      optional($.type_identifier),
      ';'
    ),

    variable_declaration: $ => seq(
      optional($.object_keyword),
      'var',
      field('name', $.identifier),
      '=',
      field('value', $._expression),
      optional($.type_identifier),
      ';'
    ),

    variable_type_assignment: $ => seq(
      'var',
      field('name', $.identifier),
      optional($.type_identifier),
      ';'
    ),

    variable_assignment: $ => seq(
      field('name', $._expression),
      '=',
      field('value', $._expression),
      optional($.type_identifier),
      ';'
    ),

    constant_declaration: $ => seq(
      'const',
      field('name', $.identifier),
      '=',
      field('value', $._expression),
      optional($.type_identifier),
      ';'
    ),

    type_definition: $ => seq(
      'typedef',
      field('name', $.identifier),
      field('type', $.type_identifier),
    ),

    type_identifier: $ => prec.right(1, seq(
      'as',
      field('type', choice(
        $._expression,
        $._container_type,
        $.method_type,
      )),
      field('nullable', optional($.nullable)),
    )),

    method_type: $ => prec(1,seq(
      'Method',
      $.parameter_list,
      $.type_identifier,
    )),

    nullable: $ => '?',

    _container_type: $ => seq(
      choice(
        $.array_type,
        $.dictionary_type,
      )
    ),

    array_type: $ => prec.right(1, seq(
      choice(
        'Array',
        'Lang.Array',
        'Toybox.Lang.Array',
      ),
      optional(seq(
        '<',
        choice(
          $._expression,
          $._container_type,
        ),
        '>',
      )),
    )),

    dictionary_type: $ => prec.right(1, seq(
      choice(
        'Dictionary',
        'Lang.Dictionary',
        'Toybox.Lang.Dictionary',
      ),
      optional(seq('<',
        seq(
          field('key', $._expression),
          ',',
          field('value', $._expression),
        ),
        '>',
      )),
    )),

    if_statement: $ => prec.right(seq(
      'if',
      field('condition', seq(
        '(',
        $._expression,
        ')'
      )),
      field('consequence', $._statement),
      optional(seq('else', 'if', field('alternative', $._statement))),
      optional(seq('else', field('alternative', $._statement))),
    )),

    while_statement: $ => seq(
      'while',
      field('condition', seq(
        '(',
        $._expression,
        ')',
      )),
      field('body', $._statement),
    ),

    do_while_statement: $ => seq(
      'do',
      field('body', $._statement),
      'while',
      field('condition', seq(
        '(',
        $._expression,
        ')',
      )),
      ';',
    ),

    for_statement: $ => seq(
      'for',
      '(',
      field('initializer', $.variable_declaration),
      field('condition', $._expression_statement),
      field('increment', $._expression),
      ')',
      field('body', $.block_statement),
    ),

    switch_case_statement: $ => seq(
      'switch',
      '(',
      field('object', $._expression),
      ')',
      '{',
      repeat1($.case_statement),
      optional($.default_statement),
      '}'
    ),

    case_statement: $ => seq(
      'case',
      field('case', $._expression),
      ':',
      repeat(field('consequence', $._statement)),
    ),

    default_statement: $ => seq(
      'default',
      ':',
      repeat($._statement)
    ),

    enum_definition: $ => seq(
      'enum',
      '{',
      sepBy(',', $.enum_entry),
      '}',
    ),

    enum_entry: $ => seq(
      $.identifier,
      optional(seq('=', $.number_literal)),
    ),

    try_catch_statement: $ => seq(
      field('try', seq(
        'try',
        $.block_statement,
      )),
      field('catch', repeat1(seq(
        'catch',
        $.parameter_list,
        $.block_statement,
      ))),
      field('finally', optional(seq(
        'finally',
        $.block_statement
      ))),
    ),

    throw_statement: $ => seq(
      'throw',
      $._expression,
      ';'
    ),

    return_statement: $ => seq(
      'return',
      optional($._expression),
      ';'
    ),

    break_statement: $ => seq(
      'break',
      ';'
    ),

    continue_statement: $ => seq(
      'continue',
      ';'
    ),

    empty_statement: $ => ';',

    _expression: $ => choice(
      $.identifier,
      $.symbol,
      $.global_namespace,
      $.new_expression,
      $.parenthesized_expression,
      $.string_literal,
      $.number_literal,
      $.boolean_literal,
      $.binary_expression,
      $.unary_expression,
      $.arithmetic_expression,
      $.function_call,
      $.container_access,
      $.array_expression,
      $.dictionary_expression,
      $.property_access,
      $.ternary_expression,
      $.assignment_expression,
      $.compound_assignment_expression,
      $.type_check_expression,
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    symbol: $ => /:[a-zA-Z_][.a-zA-Z0-9_]*/,

    global_namespace: $ => '$',

    string_literal: $ => token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"')),

    number_literal: $ => token(/[0-9]+(\.[0-9]+)?/),

    boolean_literal: $ => choice('true', 'false'),

    new_expression: $ => prec(1, seq(
      'new',
      choice(
        $.array_constructor,
        $.object_constructor,
        $.function_call,
      ),
    )),

    object_constructor: $ => prec(1, seq(
      $.property_access,
      $.parameter_list,
    )),

    parenthesized_expression: $ => prec(1,seq(
      '(',
      $._expression,
      ')',
    )),

    binary_expression: $ => prec.left(1, seq(
      field('left', $._expression),
      field('operator', $.operator),
      field('right', $._expression)
    )),

    unary_expression: $ => prec.left(1, seq(
      field('operator', choice('+', '-', '!', '~')),
      field('expression', $._expression),
    )),

    arithmetic_expression: $ => prec(1,choice(
      seq(
        $.arithmetic_operator,
        $.identifier,
      ),
      seq(
        $.identifier,
        $.arithmetic_operator,
      ),
    )),

    function_call: $ => prec(2, seq(
      field('function', $._expression),
      $.parameter_list,
    )),

    object_keyword: $ => choice('public', 'private', 'static'),

    function_definition: $ => seq(
      optional($.object_keyword),
      'function',
      field('name', $.identifier),
      $.parameter_list,
      optional($._return_type),
      field('body', $.block_statement),
    ),

    parameter_list: $ => seq(
      '(',
      sepBy(',', seq(
        $._expression,
        optional($.type_identifier),
      )),
      ')',
    ),

    _return_type: $ => $.type_identifier,

    type_check_expression: $ => prec.left(seq(
      field('left', $._expression),
      field('operator', $.object_operator),
      field('right', $._expression),
    )),

    array_constructor: $ => prec(1, seq(
      choice(
        seq(optional($.array_type),
          '[',
          field('size', $.number_literal),
          ']',
        ),
        seq(
          'Array',
          $.parameter_list,
        ),
      )
    )),

    array_expression: $ => prec.right(1, seq(
      '[',
      sepBy(',', $._expression),
      optional(','),
      ']',
      optional($.type_identifier),
    )),

    container_access: $ => prec.right(3, seq(
      field('name', $._expression),
      '[',
      field('index', $._expression),
      ']',
    )),

    dictionary_expression: $ => prec.right(seq(
      '{',
      sepBy(',', $.dictionary_entry),
      optional(','),
      '}',
    )),

    dictionary_entry: $ => seq(
      field('key', $._expression),
      '=>',
      field('value', $._expression),
    ),

    property_access: $ => prec.left(3, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier),
    )),

    ternary_expression: $ => prec.right(4, seq(
      field('condition', $._expression),
      '?',
      field('consequence', $._expression),
      ':',
      field('alternative', $._expression),
    )),

    assignment_expression: $ => prec.right(5, seq(
      field('left', $.identifier),
      '=',
      field('right', $._expression),
    )),

    compound_assignment_expression: $ => prec.right(5, seq(
      field('left', $.identifier),
      field('operator', $.assignment_operator),
      field('right', $._expression),
    )),

    assignment_operator: $ => choice(
      '+=',
      '-=',
      '*=',
      '/=',
      '%=',
      '<<=',
      '>>=',
      '&=',
      '|=',
      '^=',
    ),

    arithmetic_operator: $ => choice(
      '++',
      '--',
    ),

    operator: $ => choice(
      '+',
      '-',
      '*',
      '/',
      '%',
      '<',
      '>',
      '==',
      '<=',
      '>=',
      '!=',
      '&&',
      '||',
      'or',
    ),

    object_operator: $ => choice(
      'instanceof',
      'has',
    ),

    comment: $ => token(choice(
      seq('//', /(\\(.|\r?\n)|[^\\\n])*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )
    )),

  },
});

function sepBy(separator, rule) {
  const separatedRule = seq(rule, repeat(seq(separator, rule)));
  return optional(separatedRule);
}
