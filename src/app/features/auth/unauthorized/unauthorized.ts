import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink],
  template: `
    <div class="unauthorized-container">
      <div class="card">
        <span class="material-symbols-outlined icon">gpp_bad</span>
        <h1>Access Denied</h1>
        <p>You do not have the required permissions to view this page.</p>
        <button routerLink="/login" class="btn-back">Return to Login</button>
      </div>
    </div>
  `,
  styles: `
    .unauthorized-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f8f9ff;
      font-family: 'Inter', sans-serif;
      padding: 16px;
    }
    .card {
      background-color: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      text-align: center;
      max-width: 400px;
      width: 100%;
    }
    .icon {
      font-size: 64px;
      color: #dc2626;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      color: #0f172a;
      margin-bottom: 12px;
    }
    p {
      color: #475569;
      font-size: 15px;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .btn-back {
      background-color: #3525cd;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.3s ease;
      width: 100%;
    }
    .btn-back:hover {
      background-color: #2e20b8;
    }
  `
})
export class Unauthorized {}
