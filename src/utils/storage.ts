import localforage from 'localforage'

export function setLocalObjects(value) {
  try {
    localforage.setItem('Objects', JSON.stringify(value))
  } catch (error) {
    console.error('setLocalObjects', error)
  }
}

export async function getLocalObjects() {
  try {
    const value = await localforage.getItem('Objects')

    return value ? JSON.parse(value as string) : []
  } catch (error) {
    console.error('getLocalObjects', error)
  }

  return []
}

export function removeLocalObjects() {
  localforage.removeItem('Objects')
}
