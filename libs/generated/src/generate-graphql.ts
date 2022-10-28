import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { Parser } from 'graphql-js-tree';
import { TreeToTS, Utils } from 'graphql-zeus';


const main = async () => {
    const reversedArgs = process.argv.reverse();
    const project = reversedArgs[0]
    const url = reversedArgs[1]
    const schema = await Utils.getFromUrl(url)
    const typeScriptDefinition = TreeToTS.resolveTree({ tree: Parser.parse(schema) });
    const targetPath = `src/graphql/${project}.ts`
    mkdirSync(dirname(targetPath), { recursive: true })
    writeFileSync(targetPath, typeScriptDefinition);
}

void main()
