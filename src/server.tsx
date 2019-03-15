import * as morgan from 'morgan';
import * as Express from 'express';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { SheetsRegistry } from 'react-jss';
import { StaticRouter } from 'react-router';
import Chain from './App';
import * as csso from 'csso';

const pageTemplate = (req: Express.Request, res: Express.Response) => {
	const route = {};
	const sheets = new SheetsRegistry();

	const components = (
		<StaticRouter location={req.url} context={route}>
			<Chain registry={sheets} />
		</StaticRouter>
	);

	const html = renderToString(components);
	const css = csso.minify(sheets.toString()).css;

	res.send(`<!DOCTYPE html>
		<html lang="ru">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>${res.locals.title || 'Frontend Boilerplate'}</title>
			<style type="text/css" id="critical-styles">${css}</style>
		</head>
		<body>
			<div data-render="ssr" id="root">${html}</div>
		</body>
		</html>
	`);
}

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const app = Express();

const errorRequestHandler: Express.ErrorRequestHandler = (err, _req, _res, _next) => {
	console.error(err);
}

app.use('/build', Express.static('build/static'));
app.all('*', morgan('common'));
app.use('/', Express.static('static'));
app.all('/', pageTemplate);
app.all('/:page', pageTemplate);
app.all('*', errorRequestHandler);

process.on('unhandledRejection', (reason, promise) => {
	console.error("Unhandled rejection at:\n", promise, "\n\nReason: ", reason);
	process.exit(1);
});

app.listen(+PORT, HOST, () => {
	console.log(`Server @ http://${HOST}:${PORT}`);
});