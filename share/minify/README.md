# @financial-pfms/minify

`js`파일을 [terser](https://terser.org/)를 활용하여 압축하는 패키지입니다.

## installation

```bash
npm install @financial-pfms/minify
```

## how to use

번들링이나 패키징 이후에 압축을 원하는 폴더를 지정해서 사용하시면 됩니다.

```json
{
    "scripts": {
        "build:pkg": "rollup -c --bundleConfigAsCjs"
    }
}
```

## why?

-   `terser`는 자바스크립트 파일을 압축하고 난독화하여 파일 크기를 줄여주고 결과적으로 사용자에게 전달되는 리소스의 크기를 크게 줄여줍니다.
-   번들링시에도 `terser`를 활용하여 압축을 해주지만, 미리 라이브러리를 압축해서 전달하면 `npm install` 시간도 단축하고, 애플리케이션 빌드를 조금더 빠르게 해줍니다.

## limitation

-   safari10/11에 버그가 있어서 terser가 풀 파워로 동작하지 못하는 이슈가 있습니다. https://github.com/jupyterlab/jupyterlab/pull/6752
-   className은 압축하지 않습니다. (혹시 모를 사태 방지)
-   압축은 해주지만 별도의 소스맵은 제공하지 않고 있습니다. 디버깅에 조금 어려움이 있을 수 있습니다.
