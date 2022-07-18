export function saveObj2LocalStorage(obj) {
  let localData = getLocalStorageOfObj()

  let _localData: string[] = !!localData ? JSON.parse(localData) : [] as string[]

  _localData.push(obj)

  setLocalStorageOfObj(_localData)
}

export function getLocalStorageOfObj() {
  return localStorage.getItem('Objects') || ''
}

export function setLocalStorageOfObj(value) {
  try {
    localStorage.setItem('Objects', JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

export function removeLocalStorageOfObj() {
  localStorage.removeItem('Objects')
}
