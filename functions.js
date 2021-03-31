module.exports = {
    formatDate: function (date, showTime = true) {
        
            if (!(date instanceof Date)) {
                throw 'Error: date must be a Date object!';
            }

            const [day, month, hour, minute, second] =
                [
                    date.getDate(),
                    date.getMonth() + 1,
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds()
                ].map(n => n.toString().padStart(2, '0'));


            return `${day}/${month}/${date.getFullYear()} ` + (showTime && `${hour}:${minute}:${second}`);
        
    },
};