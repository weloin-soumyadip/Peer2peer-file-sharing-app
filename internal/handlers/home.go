package handlers

import (
    "net/http"
    "Peer2peer-file-sharing-app/internal/templates"
)

// PageData represents the template data structure
type PageData struct {
	Hostname string
	ClientIP string
}

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>P2P File Share Portal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0a0c10;
            --bg-secondary: rgba(18, 22, 32, 0.7);
            --border-color: rgba(255, 255, 255, 0.08);
            --accent-primary: #3b82f6;
            --accent-secondary: #8b5cf6;
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --success: #10b981;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow-x: hidden;
            position: relative;
        }

        /* Glowing background blobs */
        .blob {
            position: absolute;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            filter: blur(120px);
            z-index: 0;
            opacity: 0.15;
            pointer-events: none;
        }

        .blob-1 {
            background: var(--accent-primary);
            top: -100px;
            left: -100px;
        }

        .blob-2 {
            background: var(--accent-secondary);
            bottom: -100px;
            right: -100px;
        }

        .container {
            width: 100%;
            max-width: 800px;
            padding: 2rem;
            z-index: 10;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        header {
            text-align: center;
            margin-bottom: 1rem;
        }

        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 3rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            background: linear-gradient(135deg, #60a5fa, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        p.subtitle {
            color: var(--text-secondary);
            font-size: 1.1rem;
        }

        .card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 2.5rem;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            gap: 2rem;
            transition: border-color 0.3s ease;
        }

        .card:hover {
            border-color: rgba(96, 165, 250, 0.3);
        }

        .devops-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            border-top: 1px solid var(--border-color);
            padding-top: 1.5rem;
        }

        .info-box {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            padding: 1.25rem;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .info-label {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
            font-weight: 600;
        }

        .info-value {
            font-family: 'Outfit', monospace;
            font-size: 1.1rem;
            color: var(--text-primary);
            word-break: break-all;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            align-self: center;
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
            padding: 0.5rem 1rem;
            border-radius: 100px;
            font-size: 0.9rem;
            font-weight: 600;
            border: 1px solid rgba(16, 185, 129, 0.2);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }

        .upload-mockup {
            border: 2px dashed rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 3rem 1.5rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }

        .upload-mockup:hover {
            border-color: var(--accent-primary);
            background: rgba(59, 130, 246, 0.02);
        }

        .upload-icon {
            font-size: 2.5rem;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        footer {
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.85rem;
            margin-top: auto;
            padding: 2rem 0;
            width: 100%;
            border-top: 1px solid var(--border-color);
        }

        @media (max-width: 600px) {
            .devops-info {
                grid-template-columns: 1fr;
            }
            h1 {
                font-size: 2.2rem;
            }
            .container {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="container">
        <header>
            <h1>Peer2Peer Portal</h1>
            <p class="subtitle">Secure, fast, and serverless peer-to-peer file sharing</p>
        </header>

        <main class="card">
            <div class="badge">
                <span style="display:inline-block; width:8px; height:8px; background-color:var(--success); border-radius:50%;"></span>
                Containerized & Deployment-Ready
            </div>

            <div class="upload-mockup">
                <div class="upload-icon">⚡</div>
                <h3>Drag & Drop Files Here</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Files will be shared directly peer-to-peer via WebRTC</p>
            </div>

            <div class="devops-info">
                <div class="info-box">
                    <span class="info-label">Active Hostname (Pod ID)</span>
                    <span class="info-value">{{.Hostname}}</span>
                </div>
                <div class="info-box">
                    <span class="info-label">Client IP Address</span>
                    <span class="info-value">{{.ClientIP}}</span>
                </div>
            </div>
        </main>

        <footer>
            Built for learning DevOps with Go, Docker, Kubernetes (EKS), & AWS.
        </footer>
    </div>
</body>
</html>
`

// Home handles request for the home page
func Home(w http.ResponseWriter, r *http.Request) {
	// hostname, err := os.Hostname()
	// if err != nil {
	// 	hostname = "Unknown Host"
	// }

	// // Try to get remote IP
	// clientIP := r.Header.Get("X-Forwarded-For")
	// if clientIP == "" {
	// 	clientIP = r.RemoteAddr
	// }

	// tmpl, err := template.New("index").Parse(htmlTemplate)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// data := PageData{
	// 	Hostname: hostname,
	// 	ClientIP: clientIP,
	// }

	// w.Header().Set("Content-Type", "text/html; charset=utf-8")
	// tmpl.Execute(w, data)

    templates.Render(w, "home.html", nil)
}
