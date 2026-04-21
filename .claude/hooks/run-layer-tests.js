// PostToolUse hook: when a source file in a tracked layer is written/edited,
// run that layer's Vitest tests. Exits 2 (asyncRewake) on failure, 0 on pass.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

let raw = ''
process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdin.on('data', chunk => { raw += chunk })
process.stdin.on('end', () => {
  let input
  try { input = JSON.parse(raw) } catch { process.exit(0) }
  run(input)
})

function run(input) {
  const rawPath = (input.tool_input && input.tool_input.file_path) || ''
  const filePath = rawPath.replace(/\\/g, '/')

  const layer = detectLayer(filePath)
  if (!layer) process.exit(0)

  // Two levels up from .claude/hooks/
  const projectRoot = join(new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'), '..', '..')
  const testDir = join(projectRoot, 'src', layer, '__tests__')
  if (!existsSync(testDir)) process.exit(0)

  const result = spawnSync('npx', ['vitest', 'run', '--reporter=verbose', `src/${layer}`], {
    cwd: projectRoot,
    encoding: 'utf8',
    shell: true,
  })

  if (result.status === 0) process.exit(0)

  const out = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
  process.stdout.write(out + '\n')
  process.exit(2)
}

function detectLayer(fp) {
  if (/\/src\/store\//.test(fp))      return 'store'
  if (/\/src\/db\//.test(fp))         return 'db'
  if (/\/src\/components\//.test(fp)) return 'components'
  if (/\/src\/types\//.test(fp))      return 'types'
  if (/\/src\/App\.tsx$/.test(fp))    return 'components'
  return null
}
