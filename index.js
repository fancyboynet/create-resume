const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const inquirer = require('inquirer')
const shell = require('shelljs')
const argv = require('yargs').argv
const { log } = require('./utils')
const showdown  = require('showdown')
const pdf = require('html-pdf')

const filePathParam = argv._[0]
if (!filePathParam) {
  log.error('Please enter the md file path.')
  shell.exit(1)
}
const filePath = path.resolve(process.cwd(), filePathParam)
if (!fs.existsSync(filePath)){
  log.error('The md file path does not exist')
  shell.exit(1)
}

const output = argv.output

const htmlFilePath = filePath.replace(/\.md$/i, '.html')
const pdfFilePath = filePath.replace(/\.md$/i, '.pdf')

const styleFile = path.resolve(process.cwd(), './node_modules/github-markdown-css/github-markdown.css')

const converter = new showdown.Converter()

function renderHtml(content, style) {
  const article = converter.makeHtml(content)
  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
      <style>
        .markdown-body {
          box-sizing: border-box;
          min-width: 200px;
          max-width: 980px;
          margin: 0 auto;
          padding: 45px;
        }
      
        @media (max-width: 767px) {
          .markdown-body {
            padding: 15px;
          }
        }
      </style>
      <style>
        ${style}
      </style>
    </head>
    <body>
      <article class="markdown-body">
        ${article}
      </article>
    </body>
  </html>
  `
  return html
}

async function getStyle () {
  return await fsPromises.readFile(styleFile, 'utf8')
}

async function getContent () {
  return await fsPromises.readFile(filePath, 'utf8')
}

async function writeHtml (html) {
  return await fsPromises.writeFile(htmlFilePath, html, 'utf8')
}

async function getHtml() {
  const content = await getContent()
  const style = await getStyle()
  const html = renderHtml(content, style)
  return html
}

async function writePdf (html) {
  pdf.create(html).toFile(pdfFilePath, function(err, res) {
    if (err) return log.error(err.message);
  })
}

getHtml().then((html) => {
  if (output === 'pdf') {
    writePdf(html)
  } else {
    writeHtml(html)
  }
})


