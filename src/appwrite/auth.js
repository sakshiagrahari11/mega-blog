import { Client, Account, ID } from 'appwrite';
import conf from '../conf/conf'

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)      // Ensure conf.appwriteUrl is valid
            .setProject(conf.appwriteProjectId); // Ensure conf.appwriteProjectId is valid
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        console.log({ email, password, name });

        try {
            // Use ID.unique() to automatically generate a valid user ID
            const userAccount = await this.account.create(ID.unique(), email, password);
            
            if (userAccount) {
                await this.login({ email, password });
                return userAccount;
            }
            return userAccount;
        } catch (error) {
            throw new Error('Failed to create account: ' + error.message);
        }
    }

    async login({ email, password }) {
        try {
            // No need to pass a userId here, use email and password to create a session
            return await this.account.createSession(email, password);
        } catch (error) {
            throw new Error('Login failed: ' + error.message);
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;
