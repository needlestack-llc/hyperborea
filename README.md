# ❄️ Hyperborea

A simple remote file browser.

Requirements:

-   Node >=LTS

## Developing

```sh
pnpm install
pnpm run dev
```

## Building

```sh
pnpm install
pnpm run build
```

## Usage

```sh
node dist/index.js ./path/to/serve
```

## Configuration

```json
{
	"directory": "/path/to/files",	// This path needs to be absolute
	"port": 3000,
	"newTab": false,				// Whether or not to open files in a new tab
	"basicAuth": {
		"credentials": {
			{
				"username": "user",
				"password": "password"
			}
		]
	}
}

```
