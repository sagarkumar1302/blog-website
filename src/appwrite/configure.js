import config from "../config/config";
import { Client, Account, Databases, Storage, Query, ID } from "appwrite";
export class AppwriteService {
  client = new Client();
  account;
  databases;
  storage;
  constructor() {
    this.client
      .setEndpoint(config.appWrite)
      .setProject(config.appWritePorjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      const response = await this.databases.createDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug,
        {
          title,
          slug,
          content,
          featuredImage,
          status,
          userId,
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      const response = await this.databases.updateDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug,
        {
          title,
          slug,
          content,
          featuredImage,
          status,
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }
  async getPost(slug) {
    try {
      const response = await this.databases.getDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug
      );
      return response;
    } catch (error) {
      console.error("Error getting post:", error);
      throw error;
    }
  }
  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false
    }
  }
  async getPosts(queries = [Query.equal("status", "published")]) {
    try {
      const response = await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        queries,
      );
      return response.documents;
    } catch (error) {
      console.error("Error getting posts:", error);
      throw error;
    }
  }
  async uploadFile(file) {
    try {
      const response = await this.storage.createFile(
        config.appWriteBucketId,
        ID.unique(),
        file
      );
      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      return false
    }
  }
  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile(config.appWriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false
    }
  }
  getFilePreviewURL(fileId) {
    return this.storage.getFilePreview(config.appWriteBucketId, fileId);
  }
}
const service = new AppwriteService();
export default service;
