export default {
  meta: {
    type: 'problem',
    fixable: 'code',
    messages: {
      unescaped:
        "Unescaped character '{{char}}' found. Use '{{escape}}' instead.",
    },
  },
  create(context) {
    const replacements = {
      "'": '&apos;',
      '"': '&quot;',
      '>': '&gt;',
      '<': '&lt;',
      '{': '&#123;',
      '}': '&#125;',
    };

    return {
      JSXText(node) {
        const sourceCode = context.getSourceCode();
        const text = sourceCode.getText(node);

        // Check if text contains any unescaped characters (not already escaped)
        for (const [char, escape] of Object.entries(replacements)) {
          // Only match characters that are not part of an existing HTML entity
          const regex = new RegExp(
            `${escapeRegExp(char)}(?![a-z0-9#]+;)`,
            'gi'
          );

          if (regex.test(text)) {
            context.report({
              node,
              messageId: 'unescaped',
              data: { char, escape },
              fix(fixer) {
                // Replace only unescaped characters (not part of existing entities)
                const fixedText = text.replace(regex, escape);
                return fixer.replaceText(node, fixedText);
              },
            });
            // Only report the first unescaped character found to avoid multiple reports for the same node
            break;
          }
        }
      },
    };
  },
};

// Helper function to escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
