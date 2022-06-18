import moment from 'moment';

export const formatDate = (date) => {
    return moment(date).format("DD MMM YYYY");
}

export const formatDateOnlyTime = (date) => {
    return moment(date).format("hh:mm a");
}