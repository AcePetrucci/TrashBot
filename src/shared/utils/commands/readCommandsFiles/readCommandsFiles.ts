import fs from 'node:fs';
import path from 'node:path';


/**
 * Commands Files Tracker
 */

export const readCommandsFiles = (type: string) => {

  const commandsPath = path.join(__dirname, '../../../../bot/commands');
  const commandsDir = fs.readdirSync(commandsPath);


  /**
   * Recursive Flatten Commands
   */

  const flattenCommandsPath = (
    path: string,
    subDir: string | string[]
  ) => {
    const multipleDirs = Array.isArray(subDir);
    
    const subDirectory = multipleDirs
      ? subDir.flatMap(dir => flattenCommandsPath(path, dir))
      : fs.readdirSync(path.concat(`/${subDir}`));

    const subDirFiles: string[] = subDirectory.filter(file => (
      file.endsWith('.slash.js') || file.endsWith('.legacy.js')
    ));

    return !!subDirFiles.length
      ? subDirFiles.flatMap(file => multipleDirs
        ? file
        : path.concat(`/${subDir}/${file}`)
      )
      : flattenCommandsPath(path.concat(`/${subDir}`), subDirectory)
  }

  const flattenedCommands = commandsDir
    .flatMap(dir => flattenCommandsPath(commandsPath, dir))
    .filter(file => file.endsWith(type));


  /**
   * Return Flattened Commands Path
   */

  return { flattenedCommands };
}