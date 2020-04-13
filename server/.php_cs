<?php
/*
 * This document has been generated with
 * https://mlocati.github.io/php-cs-fixer-configurator/#version:2.16.2|configurator
 * you can change this configuration by importing this file.
 */
return PhpCsFixer\Config::create()
    ->setRiskyAllowed(true)
    ->setIndent('  ')
    ->setRules([
        'ternary_to_null_coalescing' => true,
        'trailing_comma_in_multiline_array' => true,
        'standardize_not_equals' => true,
        'combine_consecutive_issets' => true,
        'backtick_to_shell_exec' => true,
        'ereg_to_preg' => true,
        'encoding' => true,
        'include' => true,
        'braces' => ['position_after_anonymous_constructs'=>'same','position_after_control_structures'=>'same','position_after_functions_and_oop_constructs'=>'same'],
        'normalize_index_brace' => true,
        'no_spaces_around_offset' => true,
        'no_blank_lines_after_class_opening' => true,
        'blank_line_after_namespace' => true,
        'blank_line_after_opening_tag' => true,
        'class_attributes_separation' => true,
        'hash_to_slash_comment' => true,
        'line_ending' => true,
        'blank_line_before_statement' => true,
        'method_argument_space' => true,
        'constant_case' => true,
        'linebreak_after_opening_tag' => true,
        'no_spaces_after_function_name' => true,
        'align_multiline_comment' => true,
        'class_definition' => true,
        'elseif' => true,
        'explicit_indirect_variable' => true,
        'explicit_string_variable' => true,
        'final_static_access' => true,
        'full_opening_tag' => true,
        'function_declaration' => true,
        'function_typehint_space' => true,
        'list_syntax' => ['syntax'=>'short'],
        'lowercase_cast' => true,
        'lowercase_keywords' => true,
        'lowercase_static_reference' => true,
        'magic_constant_casing' => true,
        'new_with_braces' => true,
        'no_closing_tag' => true,
        'no_short_echo_tag' => true,
        'no_mixed_echo_print' => true,
        'no_trailing_comma_in_singleline_array' => true,
        'no_trailing_whitespace_in_comment' => true,
        'no_useless_return' => true,
        'no_useless_else' => true,
        'object_operator_without_whitespace' => true,
        'single_class_element_per_statement' => true,
        'single_blank_line_before_namespace' => true,
        'single_blank_line_at_eof' => true,
        'single_quote' => true,
        'single_line_throw' => true,
        'single_line_comment_style' => true,
        'space_after_semicolon' => true,
        'switch_case_space' => true,
        'switch_case_semicolon_to_colon' => true,
        'single_import_per_statement' => true,
        'no_trailing_whitespace' => true,
        'no_spaces_inside_parenthesis' => true,
        'indentation_type' => true,
        'magic_method_casing' => true,
    ])
    ->setFinder(PhpCsFixer\Finder::create()
        ->exclude('vendor')
        ->in(__DIR__)
    )
;
