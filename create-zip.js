
const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

// Define o caminho de saída do arquivo ZIP
const outputFileName = 'background-video-fix.zip'
const outputFilePath = path.join(__dirname, outputFileName)
const SOURCE_FOLDER = 'src'

// Cria um stream de escrita para o arquivo ZIP
const output = fs.createWriteStream(outputFilePath)
const archive = archiver('zip', {
    zlib: { level: 9 } // Nível de compressão (0-9)
})

// Eventos do archiver
output.on('close', function () {
    console.log(`Arquivo ZIP criado com sucesso: ${outputFilePath}`)
    console.log(`Tamanho total: ${archive.pointer()} bytes`)
})

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        // Logar aviso para arquivos/pastas não encontrados
        console.warn('Aviso do Archiver:', err.message)
    } else {
        // Rejeitar outros erros
        throw err
    }
})

archive.on('error', function (err) {
    console.error('Erro ao criar o ZIP:', err)
    throw err
})

// Pipe o stream do archiver para o stream de saída
archive.pipe(output)

// Adicionar pastas e arquivos ao ZIP
archive.directory(path.join(__dirname, SOURCE_FOLDER, 'css'), 'css')
archive.directory(path.join(__dirname, SOURCE_FOLDER, 'icons'), 'icons')
archive.directory(path.join(__dirname, SOURCE_FOLDER, 'js'), 'js')
archive.file(path.join(__dirname, SOURCE_FOLDER, 'action.html'), { name: 'action.html' })
archive.file(path.join(__dirname, SOURCE_FOLDER, 'background-video-fix.js'), { name: 'background-video-fix.js' })
archive.file(path.join(__dirname, SOURCE_FOLDER, 'manifest.json'), { name: 'manifest.json' })
archive.file(path.join(__dirname, 'LICENSE'), { name: 'LICENSE' })
archive.file(path.join(__dirname, 'readme.md'), { name: 'readme.md' })

// Finalizar o arquivo ZIP
archive.finalize()