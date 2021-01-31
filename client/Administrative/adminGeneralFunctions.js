export const clearForm = function() {
    $(':input').not(':button, :submit, :reset, :hidden').removeAttr('checked').removeAttr('selected').not('‌​:checkbox, select').val('').removeAttr('value');
}