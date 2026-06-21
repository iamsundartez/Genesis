// js/charts.js

window.GenesisCharts = {
    renderDashboardRadar: function() {
        const container = document.getElementById('dashboard-radar-chart');
        if (!container) return;
        
        container.innerHTML = '<canvas id="radarCanvas" width="400" height="350"></canvas>';
        const canvas = document.getElementById('radarCanvas');
        const ctx = canvas.getContext('2d');
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 120;
        
        // Data corresponding to NIST Functions: ID, PR, DE, RS, RC
        const labels = ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'];
        const scores = [0.78, 0.62, 0.85, 0.90, 0.75]; // percentages
        const sides = 5;
        
        // Draw web
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let level = 1; level <= 4; level++) {
            const r = radius * (level / 4);
            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
                const angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw axes and labels
        ctx.font = '12px Inter';
        ctx.fillStyle = '#A09EB0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const dataPoints = [];
        
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
            
            // Axis line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
            ctx.stroke();
            
            // Label
            const labelX = centerX + (radius + 20) * Math.cos(angle);
            const labelY = centerY + (radius + 20) * Math.sin(angle);
            ctx.fillText(labels[i], labelX, labelY);
            
            // Data point
            const dpR = radius * scores[i];
            dataPoints.push({
                x: centerX + dpR * Math.cos(angle),
                y: centerY + dpR * Math.sin(angle)
            });
        }
        
        // Draw data shape
        ctx.beginPath();
        for (let i = 0; i < dataPoints.length; i++) {
            if (i === 0) ctx.moveTo(dataPoints[i].x, dataPoints[i].y);
            else ctx.lineTo(dataPoints[i].x, dataPoints[i].y);
        }
        ctx.closePath();
        
        // Fill
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(161, 0, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(0, 245, 212, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Stroke
        ctx.strokeStyle = '#A100FF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw dots
        ctx.fillStyle = '#00F5D4';
        dataPoints.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
};
