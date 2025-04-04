import config from "../config/config";
import { Client, Account, ID } from "appwrite";
export class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(config.appWrite)
      .setProject(config.appWritePorjectId);
    this.account = new Account(this.client);
    // this.databases = new Databases(this.client, config.appWriteDatabaseId);
    // this.storage = new Storage(this.client, config.appWriteBucketId);
  }
  async createAccount(email, password, name) {
    try {
      const response = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (response) {
        return this.login(email, password);
      } else {
        throw new Error("Account creation failed");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }
  async login(email, password) {
    try {
      const response = await this.account.createEmailPasswordSession(
        email,
        password
      );
      if (response) {
        return response;
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
  async logout() {
    try {
      const response = await this.account.deleteSession("current");
      if (response) {
        return response;
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
