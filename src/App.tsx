import * as React from 'react';
import withStyles, { JssProvider } from 'react-jss';

export interface IProps {
	registry: any;
}

const styles = {
	button: {
		appearance: 'none',
		border: 0,
		borderRadius: 5,
		background: '#36c',
		color: '#fff',
		padding: [[10, 15]],
	},
};

const Button = ({ classes, children }: any) => <button className={classes.button}>{children}</button>;
const ButtonWithStyles = withStyles(styles)(Button) as any;

class App extends React.PureComponent<IProps> {
	render() {
		return (
			<JssProvider registry={this.props.registry}>
				<div className="App">
					<h1>It works</h1>
					<ButtonWithStyles>Lorem ipsum</ButtonWithStyles>
				</div>
			</JssProvider>
		);
	}
}

export default App;
