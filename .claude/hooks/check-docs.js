// PostToolUse hook: fires after Write/Edit on source, spec, or config files.
// Outputs a JSON reminder for Claude to check README.md / ARCHITECTURE.md.
let raw = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(raw);
    const filePath = (input.tool_input && input.tool_input.file_path) || '';
    const shouldRemind = /[/\\]src[/\\]|ARCHITECTURE\.md$|[/\\]specs[/\\].+\.md$|package\.json$/.test(filePath);
    if (shouldRemind) {
      console.log(JSON.stringify({
        systemMessage: 'DOCS REMINDER: Check if README.md or ARCHITECTURE.md need updating.',
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: 'You just modified a source, spec, or config file. Ask yourself: does README.md or ARCHITECTURE.md need an update to reflect this change?'
        }
      }));
    }
  } catch (_) {
    // Malformed input — stay silent
  }
});
