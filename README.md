# create-resume
![npm](https://img.shields.io/npm/v/create-resume?color=sucess)
 使用markdown编写类似github样式的简历，支持生成html,pdf格式

## Install
```
yarn add create-resume
```

## Usage
```
$ yarn create-resume ./resume.md
```
```
$ yarn create-resume --output pdf ./resume.md  // output pdf
```

## Output type

- html (default)
- pdf

## Dependencies

- showdown
- html-pdf
- github-markdown-css