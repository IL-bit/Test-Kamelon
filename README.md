# Project Overview

This project is a React + TypeScript application that uses Redux for
state management and includes several custom components and SVG-based UI
elements.

## 🚀 Features

- A website for visualizing data using **line charts**
- Support for **multiple display styles**
- **Zooming** functionality for charts
- Ability to **download charts as images**
- Data view switching between **weekly** and **daily** modes
- **Light/Dark theme switching** for improved user experience

### 📊 Chart Component

A reusable `<Chart />` component located in `src/components/Chart.tsx`.

### 🧭 UI Layout Components

-   HeaderLeftCol
-   HeaderRightCol
-   ToolTip

### 🎨 SVG Icon System

Located in `src/img/`.

### 🗂️ Redux State Management

Located in `src/redux/`.

### 📄 Integrated Static Data

`data.json` provides structured data.

## 🛠️ Setup Instructions

### 1. Clone the Repository

    git clone https://github.com/IL-bit/Test-Kamelon.git
    cd <project-folder>

### 2. Install Dependencies

    npm install

### 3. Start Development Server

    npm start

## 🚀 Start Production Build

### 1. Build for Production

    npm run build

After the execution, a folder will appear:

    build/

### 2. Start a local server to view the build

Install the utility:

    npm install -g serve

Run:

    serve -s build

The website will be available at:

    http://localhost:3000

