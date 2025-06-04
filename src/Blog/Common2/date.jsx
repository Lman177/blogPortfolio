export const formatDate = (dateArray) => {
    // Kiểm tra dateArray có hợp lệ và đủ phần tử không
    // console.log("formatDate: dateArray", dateArray);
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
        // console.warn("formatDate: dateArray không hợp lệ hoặc không đủ phần tử.", dateArray);
        return 'Ngày không xác định';
    }
    // Tạo đối tượng Date. Lưu ý: tháng trong JavaScript Date object là 0-indexed (0-11).
    // API của bạn trả về tháng là 1-indexed (1-12), nên cần trừ 1.
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    // Kiểm tra xem date có phải là một ngày hợp lệ không
    if (isNaN(date.getTime())) {
        // console.warn("formatDate: dateArray tạo ra một ngày không hợp lệ.", dateArray);
        return 'Ngày không hợp lệ';
    }

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};