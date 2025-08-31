// components/ui/Calendar.js
import React from 'react';
import { Calendar as NativeCalendar } from 'react-native-calendars';
import { colors, fontWeights } from './Theme';

export function Calendar({ ...props }) {
  return (
    <NativeCalendar
      theme={{
        backgroundColor: colors.background,
        calendarBackground: colors.background,
        textSectionTitleColor: colors.mutedForeground,
        selectedDayBackgroundColor: colors.primary,
        selectedDayTextColor: colors.primaryForeground,
        todayTextColor: colors.primary,
        dayTextColor: colors.foreground,
        textDisabledColor: colors.mutedForeground,
        arrowColor: colors.primary,
        monthTextColor: colors.foreground,
        indicatorColor: colors.primary,
        textDayFontWeight: fontWeights.normal,
        textMonthFontWeight: fontWeights.semibold,
        textDayHeaderFontWeight: fontWeights.medium,
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 14,
      }}
      {...props}
    />
  );
}