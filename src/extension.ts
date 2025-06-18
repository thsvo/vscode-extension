// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Tree data provider for our custom view
class SimpleThemeProvider implements vscode.TreeDataProvider<string> {
	
	private _onDidChangeTreeData: vscode.EventEmitter<string | undefined | null | void> = new vscode.EventEmitter<string | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<string | undefined | null | void> = this._onDidChangeTreeData.event;

	getTreeItem(element: string): vscode.TreeItem {
		const item = new vscode.TreeItem(element, vscode.TreeItemCollapsibleState.None);
		item.command = {
			command: 'simpletheme.itemClicked',
			title: 'Item Clicked',
			arguments: [element]
		};
		return item;
	}

	getChildren(element?: string): Thenable<string[]> {
		if (!element) {
			return Promise.resolve(['Item added by Tariqul', 'Item 2 added by Tariqul', 'Item 3 added by Tariqul', 'Custom Action added by Tariqul']);
		}
		return Promise.resolve([]);
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}

// Tree data provider for the panel "Added by Tariqul"
class TariqulPanelProvider implements vscode.TreeDataProvider<string> {
	
	private _onDidChangeTreeData: vscode.EventEmitter<string | undefined | null | void> = new vscode.EventEmitter<string | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<string | undefined | null | void> = this._onDidChangeTreeData.event;

	getTreeItem(element: string): vscode.TreeItem {
		const item = new vscode.TreeItem(element, vscode.TreeItemCollapsibleState.None);
		item.command = {
			command: 'simpletheme.panelItemClicked',
			title: 'Panel Item Clicked',
			arguments: [element]
		};
		item.iconPath = new vscode.ThemeIcon('star');
		return item;
	}

	getChildren(element?: string): Thenable<string[]> {
		if (!element) {
			return Promise.resolve([
				'Welcome to Tariqul Panel',
				'Feature 1: Custom Actions',
				'Feature 2: Enhanced UI',
				'Feature 3: Dynamic Content',
				'Settings & Configuration'
			]);
		}
		return Promise.resolve([]);
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "simpletheme" is now active!');

	// Create Status Bar item
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 150);
	statusBarItem.text = "Hello Tariqul";
	statusBarItem.tooltip = "Simple Theme Extension - Hello Tariqul";
	statusBarItem.show();

	// Create another Status Bar item (clickable)
	const statusBarItem2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
	statusBarItem2.text = "$(info) Simple Theme";
	statusBarItem2.tooltip = "Click to show extension info";
	statusBarItem2.command = "simpletheme.showInfo";
	statusBarItem2.show();

	// Create third Status Bar item with custom SVG-like icon
	const statusBarItem3 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem3.text = "$(clock) Status";
	statusBarItem3.tooltip = "Custom SVG-styled status item";
	statusBarItem3.command = "simpletheme.toggleStatus";
	statusBarItem3.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
	statusBarItem3.show();

	// Create the tree data provider
	const treeDataProvider = new SimpleThemeProvider();

	// Create the panel data provider
	const panelDataProvider = new TariqulPanelProvider();

	// Register the tree data provider
	vscode.window.createTreeView('simpletheme.view', {
		treeDataProvider: treeDataProvider
	});

	// Register the panel data provider
	vscode.window.createTreeView('simpletheme.panelView', {
		treeDataProvider: panelDataProvider
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('simpletheme.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello Tariqul');
	});

	// Register command for opening the view
	const openViewCommand = vscode.commands.registerCommand('simpletheme.openView', () => {
		vscode.window.showInformationMessage('Simple Theme view opened!');
		treeDataProvider.refresh();
	});

	// Register command for item clicks
	const itemClickedCommand = vscode.commands.registerCommand('simpletheme.itemClicked', (item: string) => {
		vscode.window.showInformationMessage(`You clicked: ${item}`);
	});

	// Register command for panel item clicks
	const panelItemClickedCommand = vscode.commands.registerCommand('simpletheme.panelItemClicked', (item: string) => {
		vscode.window.showInformationMessage(`Panel item clicked: ${item}`, 'Execute Action', 'View Details').then(selection => {
			if (selection === 'Execute Action') {
				vscode.window.showInformationMessage(`Executing action for: ${item}`);
			} else if (selection === 'View Details') {
				vscode.window.showInformationMessage(`Details for ${item}:\nThis is a custom panel item created by Tariqul.`);
			}
		});
	});

	// Register command for status bar info click
	const showInfoCommand = vscode.commands.registerCommand('simpletheme.showInfo', () => {
		vscode.window.showInformationMessage('Simple Theme Extension v0.0.1 - Created by Tariqul', 
			'Show Details', 'Close').then(selection => {
			if (selection === 'Show Details') {
				vscode.window.showInformationMessage('Extension Features:\n- Activity Bar Icon\n- Status Bar Items\n- Custom Tree View');
			}
		});
	});

	// Register command for status toggle
	const toggleStatusCommand = vscode.commands.registerCommand('simpletheme.toggleStatus', () => {
		// Toggle between different SVG-like icons
		if (statusBarItem3.text === "$(clock) Status") {
			statusBarItem3.text = "$(heart) Active";
			statusBarItem3.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
		} else if (statusBarItem3.text === "$(heart) Active") {
			statusBarItem3.text = "$(star) Premium";
			statusBarItem3.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
		} else {
			statusBarItem3.text = "$(clock) Status";
			statusBarItem3.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
		}
		vscode.window.showInformationMessage(`Status changed to: ${statusBarItem3.text}`);
	});

	// Register command for Editor Toolbar Action
	const editorToolbarCommand = vscode.commands.registerCommand('simpletheme.editorToolbarAction', () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			const document = activeEditor.document;
			const selection = activeEditor.selection;
			const selectedText = document.getText(selection);
			
			if (selectedText) {
				vscode.window.showInformationMessage(`Selected text: "${selectedText}" - Action by Tariqul`, 
					'Format Text', 'Count Characters', 'Copy to Clipboard').then(choice => {
					if (choice === 'Format Text') {
						vscode.window.showInformationMessage(`Formatted: ${selectedText.toUpperCase()}`);
					} else if (choice === 'Count Characters') {
						vscode.window.showInformationMessage(`Character count: ${selectedText.length}`);
					} else if (choice === 'Copy to Clipboard') {
						vscode.env.clipboard.writeText(selectedText);
						vscode.window.showInformationMessage('Text copied to clipboard!');
					}
				});
			} else {
				vscode.window.showInformationMessage(`Editor Toolbar Action - File: ${document.fileName} - By Tariqul`);
			}
		}
	});

	// Register command for Custom Tab Action
	const customTabCommand = vscode.commands.registerCommand('simpletheme.customTabAction', () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			const document = activeEditor.document;
			const lineCount = document.lineCount;
			// Use path.basename instead of split with Windows separators
			const fileName = require('path').basename(document.fileName);
			
			vscode.window.showInformationMessage(`Tab Action by Tariqul`, 
				'File Info', 'Add Comment', 'Save & Close').then(choice => {
				if (choice === 'File Info') {
					vscode.window.showInformationMessage(`File: ${fileName}\nLines: ${lineCount}\nLanguage: ${document.languageId}`);
				} else if (choice === 'Add Comment') {
					const position = new vscode.Position(0, 0);
					activeEditor.edit(editBuilder => {
						editBuilder.insert(position, `// Added by Tariqul - ${new Date().toLocaleString()}\n`);
					});
				} else if (choice === 'Save & Close') {
					document.save().then(() => {
						vscode.commands.executeCommand('workbench.action.closeActiveEditor');
					});
				}
			});
		}
	});

	context.subscriptions.push(
		disposable, 
		openViewCommand, 
		itemClickedCommand, 
		panelItemClickedCommand,
		showInfoCommand, 
		toggleStatusCommand,
		editorToolbarCommand,
		customTabCommand,
		statusBarItem, 
		statusBarItem2, 
		statusBarItem3
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
