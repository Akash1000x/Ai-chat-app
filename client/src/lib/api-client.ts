import axios from "axios";

const API_BASE_URL = import.meta.env.API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL || "http://localhost:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  }
})