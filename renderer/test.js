const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // 打印 'pong'
  }

  let btn = document.getElementById('button')
  btn.addEventListener('click', ()=>{
    window.button.click()
  })

  //这个事件会覆盖掉win.webContents对context-menu的监控
  // window.addEventListener('mousedown',(event)=>{
  //   event.preventDefault()
  //   if (event.button==2){//说明是右键
  //     window.rightClick.click()
  //   }
    
  // })
  
func()