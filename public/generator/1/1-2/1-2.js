        var dateLabel = document.getElementById("date");

        window.setInterval(setTime, 1000);

        function setTime()
        {
        	var nowDate = new Date();
  
            dateLabel.innerHTML = nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds();
        }
