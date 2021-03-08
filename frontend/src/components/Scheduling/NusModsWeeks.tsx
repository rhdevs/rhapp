import NUSModerator, { AcadWeekInfo } from 'nusmoderator'

export const getWeekText = (acadWeekInfo: AcadWeekInfo) => {
  const NBSP = '\u00a0'

  const parts: string[] = [`AY20${acadWeekInfo.year}`]

  // Check for null value (ie. during vacation)
  if (acadWeekInfo.sem) {
    parts.push(acadWeekInfo.sem.replace(/ /g, NBSP))
  }

  // Do not show the week number if there is only one week, e.g. recess
  // Hide week if week type is 'Instructional'
  const type = acadWeekInfo.type === 'Instructional' ? '' : `${acadWeekInfo.type} `
  const weekNumber = acadWeekInfo.num || ''
  parts.push(`${type}Week ${weekNumber}`.replace(/ /g, NBSP))

  return parts.join(', ').trim()
}

// Text computed in an IIFE because this only needs to be computed on page load.
const NusModsWeeks = (() => {
  const acadWeekInfo = NUSModerator.academicCalendar.getAcadWeekInfo(new Date())
  return getWeekText(acadWeekInfo)
})()

export default NusModsWeeks
