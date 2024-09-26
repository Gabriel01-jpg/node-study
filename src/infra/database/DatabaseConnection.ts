import pgp from "pg-promise";


// Interface (contract) to be implemented by the database connection
export default interface DatabaseConnection {
	query (statement: string, params: any, transactional?: boolean): Promise<any>;
	close (): Promise<void>;
	commit (): Promise<void>;
}


// Implementation of the DatabaseConnection interface using pg-promise
export class PgPromiseAdapter implements DatabaseConnection {
	connection: any;

	constructor () {
		this.connection = pgp()("postgres://admin:admin@localhost:5432/codeminer");
	}

	query(statement: string, params: any): Promise<any> {
		return this.connection.query(statement, params);
	}

	close(): Promise<void> {
		return this.connection.$pool.end();
	}

	async commit(): Promise<void> {
	}

}

// Implementation of the DatabaseConnection interface using pg-promise with transactions
export class UnitOfWork implements DatabaseConnection {
	connection: any;
	statements: { statement: string, params: any }[];

	constructor () {
		this.connection = pgp()("postgres://admin:admin@localhost:5432/codeminer");
		this.statements = [];
	}

    // If transactional is true, the query will be added to the list of statements to be executed in a transaction
	async query(statement: string, params: any, transactional: boolean = false): Promise<any> {
		if (!transactional) {
			return this.connection.query(statement, params);
		} else {
			this.statements.push({ statement, params });
		}
	}

    // Close the connection to the database

	close(): Promise<void> {
		return this.connection.$pool.end();
	}


    // Execute all the statements in the list of statements in a transaction
	async commit(): Promise<void> {
		await this.connection.tx(async (t: any) => {
			const transactions = [] as any[];
			for (const statement of this.statements) {
				transactions.push(await t.query(statement.statement, statement.params));
			}
			return t.batch(transactions);
		}).then((data: any) => {
			console.log("commit");
		}).catch((data: any) => {
			console.log("rollback");
		});
	}

}