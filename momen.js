//Hãy trả lời tôi bằng tiếng việt và ngôn ngữ sẽ là javascripts và xuyên suốt cuộc hỏi bài tập về thư việt moment xuống dòng mỗi khi đủ 200 kí tự.
//Tham chiếu moment(input,format,strict)
//Hãy bọc cho tôi đoạn này mỗi khi tôi hỏi đoạn bạn trả lời sẽ là ở giữa chính là content hãy nhớ bọc mỗi lần tôi hỏi bạn trả lời ví dụ:
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------
            //content đoạn bạn trả lời.
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------add------------------------------------------------------------------------------------------------------------------------------------------
// Để sử dụng moment().add, ta cần truyền vào 2 tham số: số lượng và đơn vị thời gian cần thêm vào
// Ví dụ: Thêm 1 ngày vào ngày hiện tại
var today = moment();
var tomorrow = today.add(1, 'day');
//---------------------------------------add------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------clone----------------------------------------------------------------------------------------------------------------------------------------
// Để sử dụng clone của moment, ta có thể sử dụng phương thức clone()
// Ví dụ: Sao chép ngày hiện tại và thêm 1 giờ vào ngày sao chép
var today = moment();
var clonedDay = today.clone();
var clonedDayPlusOneHour = clonedDay.add(1, 'hour'); 
//---------------------------------------clone----------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------calendar-------------------------------------------------------------------------------------------------------------------------------------
// Để sử dụng calendar của moment, ta có thể sử dụng phương thức calendar()
// Phương thức này trả về một chuỗi đại diện cho ngày hiện tại trong một định dạng dễ đọc
// Ví dụ: Lấy ngày hiện tại và định dạng theo calendar
var today = moment();
var calendarDate = today.calendar(); // "Today at 10:30 AM" (nếu là 10:30 AM)
// Phương thức này hữu ích khi bạn muốn hiển thị ngày hiện tại dưới dạng chuỗi dễ đọc và thân thiện hơn với người dùng.
//---------------------------------------calendar-------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------creationData---------------------------------------------------------------------------------------------------------------------------------
// Để sử dụng creationData trong moment, ta có thể sử dụng cú pháp sau:
var specificDate = moment('2022-12-31', 'YYYY-MM-DD', true); 
// Tạo một đối tượng moment đại diện cho ngày 31/12/2022 với định dạng chuỗi là YYYY-MM-DD và sử dụng chế độ strict mode. 
// Chế độ strict mode sẽ đảm bảo rằng định dạng chuỗi phải chính xác với định dạng được chỉ định, nếu không sẽ trả về null. 
// Để lấy thông tin về ngày tạo đối tượng moment, ta có thể sử dụng phương thức creationData() như sau:
var creationData = specificDate.creationData();
// Phương thức này trả về một đối tượng chứa thông tin về ngày tạo đối tượng moment, bao gồm các thuộc tính như year, month, day, hour, minute, second, millisecond.
//---------------------------------------creationData----------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------format----------------------------------------------------------------------------------------------------------------------------------------
// Để định dạng lại ngày giờ theo kiểu DD-MM-YYYY cho moment, ta có thể sử dụng phương thức format()
// Ví dụ: Lấy ngày hiện tại và định dạng theo kiểu DD-MM-YYYY
var today = moment();
var formattedDate = today.format('DD-MM-YYYY'); // "31-12-2022"
//---------------------------------------format----------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------
// Để lấy số ngày trong tháng cho moment, ta có thể sử dụng phương thức daysInMonth()
// Ví dụ: Lấy số ngày trong tháng hiện tại
var today = moment();
var daysInMonth = today.daysInMonth(); // Số ngày trong tháng hiện tại (VD: 31) 

// Ví dụ khác: Lấy số ngày trong tháng 2 năm 2022
var feb2022 = moment('2022-02-01', 'YYYY-MM-DD');
var daysInFeb2022 = feb2022.daysInMonth(); // Số ngày trong tháng 2 năm 2022 (VD: 28)
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------
// Phương thức moment().day() trong thư viện moment.js được sử dụng để lấy hoặc đặt giá trị ngày trong tuần của một đối tượng moment. 
// Nếu không có tham số truyền vào, phương thức này sẽ trả về giá trị ngày trong tuần của đối tượng moment hiện tại (từ 0 đến 6, 0 là Chủ nhật, 6 là Thứ 7). 
// Nếu có tham số truyền vào, phương thức này sẽ đặt giá trị ngày trong tuần của đối tượng moment và trả về đối tượng moment đã được cập nhật. 

// Ví dụ: Lấy giá trị ngày trong tuần của ngày hiện tại
var today = moment();
var dayOfWeek = today.day(); // Giá trị từ 0 đến 6, 0 là Chủ nhật, 6 là Thứ 7

// Ví dụ: Đặt giá trị ngày trong tuần của một đối tượng moment và trả về đối tượng moment đã được cập nhật
var date = moment('2022-12-31', 'YYYY-MM-DD');
var updatedDate = date.day(1); // Đặt giá trị ngày trong tuần là Thứ 2 và trả về đối tượng moment đã được cập nhật
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------
// Phương thức diff() trong moment.js được sử dụng để tính khoảng cách giữa hai đối tượng moment. 
// Phương thức này trả về một số nguyên đại diện cho khoảng cách giữa hai đối tượng moment theo đơn vị thời gian được chỉ định (ví dụ: số ngày, số giờ, số phút, ...).
// Ví dụ: Tính khoảng cách giữa hai ngày
var date1 = moment('2022-12-31', 'YYYY-MM-DD');
var date2 = moment('2022-12-25', 'YYYY-MM-DD');
var diffInDays = date1.diff(date2, 'days'); // Khoảng cách giữa hai ngày là 6 ngày
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------
// Phương thức endOf() trong thư viện moment.js được sử dụng để đặt đối tượng moment hiện tại đến cuối của một đơn vị thời gian được chỉ định (ví dụ: cuối ngày, cuối tuần, cuối tháng, ...). 
// Đối với các đơn vị thời gian như ngày, tuần, tháng, năm, phương thức endOf() sẽ đặt đối tượng moment đến thời điểm cuối cùng của đơn vị thời gian đó. 
// Ví dụ: Đặt đối tượng moment hiện tại đến cuối ngày
var today = moment();
var endOfDay = today.endOf('day'); // Đặt đối tượng moment hiện tại đến cuối ngày và trả về đối tượng moment đã được cập nhật.
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------

var today = moment();
var formattedDate = today.format('DD-MM-YYYY'); // "31-12-2022"

//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------
// Phương thức second() trong thư viện moment.js được sử dụng để lấy hoặc đặt giá trị giây của một đối tượng moment. 
// Nếu không có tham số truyền vào, phương thức này sẽ trả về giá trị giây của đối tượng moment hiện tại (từ 0 đến 59). 
// Nếu có tham số truyền vào, phương thức này sẽ đặt giá trị giây của đối tượng moment và trả về đối tượng moment đã được cập nhật. 

// Ví dụ: Lấy giá trị giây của thời điểm hiện tại
var today = moment();
var second = today.second(); // Giá trị giây của thời điểm hiện tại (VD: 30)

// Ví dụ: Đặt giá trị giây của một đối tượng moment và trả về đối tượng moment đã được cập nhật
var date = moment('2022-12-31 23:59:59', 'YYYY-MM-DD HH:mm:ss');
var updatedDate = date.second(0); // Đặt giá trị giây là 0 và trả về đối tượng moment đã được cập nhật
//---------------------------------------comment--------------------------------------------------------------------------------------------------------------------------------------

// Đoạn mã trên tạo một đối tượng moment hiện tại và lấy giá trị ngày trong tháng của đối tượng đó bằng phương thức date(). 
// Tuy nhiên, nếu đoạn mã được chạy vào lúc nửa đêm giữa ngày 9 và ngày 10, thì giá trị ngày trong tháng sẽ là 9 chứ không phải 10. 
// Để tránh tình trạng này, ta nên sử dụng phương thức startOf('day') để đặt đối tượng moment hiện tại đến đầu ngày trước khi lấy giá trị ngày trong tháng.

var creationData2 = moment().startOf('day');
var dayOfMonth = creationData2.date(); // Lấy giá trị ngày trong tháng của đối tượng moment hiện tại (VD: 10)

// Phương thức dayOfYear() trong thư viện moment.js được sử dụng để lấy giá trị ngày trong năm của một đối tượng moment. 
// Phương thức này trả về một số nguyên đại diện cho giá trị ngày trong năm của đối tượng moment (từ 1 đến 366).
// Ví dụ: Lấy giá trị ngày trong năm của thời điểm hiện tại
var today = moment();
var dayOfYear = today.dayOfYear(); 

// Phương thức hours() trong thư viện moment.js được sử dụng để lấy hoặc đặt giá trị giờ của một đối tượng moment. 
// Nếu không có tham số truyền vào, phương thức này sẽ trả về giá trị giờ của đối tượng moment hiện tại (từ 0 đến 23). 
// Nếu có tham số truyền vào, phương thức này sẽ đặt giá trị giờ của đối tượng moment và trả về đối tượng moment đã được cập nhật. 

// Ví dụ: Lấy giá trị giờ của thời điểm hiện tại
var today = moment();
var hour = today.hours(); // Giá trị giờ của thời điểm hiện tại (VD: 14)

// Ví dụ: Đặt giá trị giờ của một đối tượng moment và trả về đối tượng moment đã được cập nhật
var date = moment('2022-12-31 23:59:59', 'YYYY-MM-DD HH:mm:ss');
var updatedDate = date.hours(0); // Đặt giá trị giờ là 0 và trả về đối tượng moment đã được cập nhật



var [times,setTime] = useState(0);
var today = moment();
var creationData2 = today.format('DD MM YYYY HH mm ss');

useEffect(()=>{
  var time = setInterval(() => {
    setTime(times+1)
  }, 1000);

  return () => clearInterval(time);
},[times]);

useEffect(()=>{
  console.log(creationData2);
},[creationData2]);



