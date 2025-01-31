# **SkyClear System – Hybrid Aircraft Engine Control with Solar Energy**  
🌐 **Live Dashboard:** [SkyClear Dashboard](https://skyclear-925d0.web.app/)  

## 📌 About the Project  
The **SkyClear System** is a **hybrid control system** for aircraft engines, integrating:  
✔️ A **combustion engine** and **electric motor**  
✔️ **Solar energy simulation**  
✔️ **PID control for CO₂ reduction**  
✔️ **Real-time monitoring via Firebase**  
✔️ **Web dashboard for remote control**  

### **Purpose**  
This project **demonstrates** hybrid propulsion, energy efficiency, and real-time IoT integration for research and educational purposes.

---

## ⚙ **System Components**
🔹 **Arduino Uno** (sensors, LEDs, buttons, PID logic)  
🔹 **Node.js Server** (USB Serial communication, Firebase sync)  
🔹 **Firebase Realtime Database** (cloud data storage)  
🔹 **React Web Interface** ([Live Dashboard](https://skyclear-925d0.web.app/))  

---

## 🛠 **Requirements**
### **Hardware**
- **Arduino Uno**, LDR sensors, LEDs, buttons, USB cable  

### **Software**
- **Arduino IDE**, **Node.js (v14+)**, **Firebase**, **React**  

---

## 🚀 **Setup & Execution**
### **1️⃣ Clone the Project**
```bash
git clone https://github.com/dmarnet/SkyClear.git
cd SkyClear
```

### **2️⃣ Configure Firebase**
1. **Create a Firebase Project**
2. **Enable Realtime Database** (`.read: true, .write: true` in rules)  
3. **Download Service Account Key**

### **3️⃣ Install Dependencies**
```bash
# Backend (Node.js)
cd arduino-firebase-gateway
npm install

# Frontend (React)
cd skyclear-dashboard
npm install
```

### **4️⃣ Upload Firmware to Arduino**
- Open `SkyClear.ino` in **Arduino IDE**  
- Select **Board: Arduino Uno** → Upload  

### **5️⃣ Start Backend (Node.js)**
```bash
cd arduino-firebase-gateway
node server.js
```

### **6️⃣ Start Frontend (React)**
```bash
cd skyclear-dashboard
npm start
```
- Open **[http://localhost:3000](http://localhost:3000)** or access the **live version:**  
  👉 [SkyClear Dashboard](https://skyclear-925d0.web.app/)  

---

## 📖 **How to Use the Web Dashboard**
- 🔥 **Combustion On/Off** → Toggle combustion engine  
- ⚡ **Electric On/Off** → Toggle electric motor  
- 🎛 **PID On/Off** → Switch between **manual & automatic**  
- 🔴🔵🟡🟢 **LEDs** → Show engine/system status  
- 🚨 **Messages/Alerts** → Warns  

---

## 👨‍💻 **Author & Contact**
### Daniel Marnet  
📧 Email: [delmarnet1@gmail.com](mailto:delmarnet1@gmail.com)  
🔗 LinkedIn: [linkedin.com/in/danielmarnet](https://linkedin.com/in/danielmarnet)  
💻 GitHub: [github.com/dmarnet](https://github.com/dmarnet)  
🌎 Portfolio: [dmarnetcv.web.app](https://dmarnetcv.web.app)  

🚀 **SkyClear is a research project designed for hybrid energy control and IoT applications. Enjoy!**
