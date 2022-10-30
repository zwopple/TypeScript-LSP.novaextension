// variable to store the language server
var langserver = null;

// activate function
exports.activate = function() {
    langserver = new TypescriptLanguageServer();
}

// deactivate function
exports.deactivate = function() {
    if (langserver) {
        langserver.deactivate();
        langserver = null;
    }
}

// language server server
class TypescriptLanguageServer {
    constructor() {
    }
    
    deactivate() {
        this.stop();
    }
    
    start(path) {
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
        }
        
        // Use the default server path
        if (!path) {
            path = '/opt/homebrew/bin/typescript-language-server';
        }
        
        // Create the client
        var serverOptions = {
            args: [
                '--stdio'
            ],
            path: path
        };
        var clientOptions = {
            syntaxes: ['javascript', 'typescript']
        };
        var client = new LanguageClient('typescript-langserver', 'Typescript Language Server', serverOptions, clientOptions);
        
        try {
            // Start the client
            client.start();
            
            // Add the client to the subscriptions to be cleaned up
            nova.subscriptions.add(client);
            this.languageClient = client;
        }
        catch (err) {
            // If the .start() method throws, it's likely because the path to the language server is invalid
            if (nova.inDevMode()) {
                console.error(err);
            }
        }
    }
    
    stop() {
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
            this.languageClient = null;
        }
    }
}

