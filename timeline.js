// 타임라인 함수
const mkTimeline = (data, dom) => {
  const init = () => {
    const body =  document.querySelector('body');
    let st =  document.createElement('style');
      st.innerText= `html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video, button, input, textarea {
      vertical-align: baseline;
      box-sizing: border-box;
      font-weight: normal;
      padding: 0px;
      margin: 0px;
      border-width: 0px;
      border-style: initial;
      border-color: initial;
      border-image: initial;
    }`
    body.prepend(st);
  }

  const catIndex = (cats, find) => {
    return cats.indexOf(find);
  }

  const setStyle = (style, dom) => {
    for (let i in style) {
      dom.style[i] = style[i];
    }
  }

  let title = data.options.title;
  let bdCol =  data.options.borderCol;
  let borderWidth =  data.options.borderWidth;
  let bdStyle=data.options.borderStyle?data.options.borderStyle: 'solid';
  let borderHdrCol =  data.options.borderHdrCol;
  let fontSize =  data.options.fontSize;




  let ul = document.createElement('ul');
  ul.style.position = 'relative';
  ul.style.overflow = 'hidden';
  let categories = [0, ...data.options.category];

  init();
  categories.forEach((_, ix) => {
    // 판 까는 부분
    let li = document.createElement('li');
    let style = {
      width: '100%',
      borderBottom: `${borderWidth}px ${bdStyle} ${bdCol}`,
      borderTop: ix === 0 ? `${borderWidth}px ${bdStyle} ${bdCol}` : '',
      borderLeft:  `${borderWidth}px ${bdStyle} ${!ix? borderHdrCol : bdCol}`,
      borderRight:  `${borderWidth}px ${bdStyle} ${!ix? borderHdrCol : bdCol}`,
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: ix == 0 ? data.options.headerBg : '',
      color: ix == 0 ? data.options.headerCol : '',
      userSelect: 'none'
    }
    setStyle(style, li);
    ul.append(li);
    !ix?data.options.dir==='rev'? console.log('반대'):console.log('롸잇'):''; 
    
    Array(data.options.max - data.options.min + 2).fill(0).map((_, i) => i + data.options.min).forEach((e, _, a) => {
      let span = document.createElement('span');
      let hg = data.options.heights;
      let style = {
        display: 'block',
        width: `calc(100% / ${a.length})`,
        textAlign: 'center',
        height: `${hg? hg : 20}px`,
        lineHeight: `${hg? hg: 20}px`,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        boxSizing:'border-box',
        whiteSpace: 'nowrap',
        borderRight: a.length !== e ?  `${borderWidth}px ${bdStyle} ${!ix? borderHdrCol : bdCol}` : '',
        userSelect: 'none'
      }
      span.innerText = ix === 0 && e === data.options.min ? title : ix === 0 ? (data.options.format?data.options.format.replace('*',e - 1): e - 1) : e === data.options.min ? categories[ix] : '';
      span.style.display = 'flex';
      span.style.textAlign = 'center';
      li.append(span);
      setStyle(style, span);
    });
    ul.append(li);
  })
  dom.append(ul);

  let dts=  data.data;
  for (let i in dts) {
    if (i !== 'options') {
      // 타임 추가 부분
      let times = document.createElement('div');
      let st = dts[i].start;
      let end = dts[i].end;
      let cate = catIndex(data.options.category, dts[i].category) !== -1 ? catIndex(data.options.category, dts[i].category) + 1 : 1000;
      let note = dts[i].label;
      let hours = Math.abs(st - end) + 1;
      let span = document.querySelector('.chart-time-line ul span');
      let wd = span.style.width.replaceAll(/[a-z|%|(|)]/gi, '') * 1;
      let hg = span.style.height.replaceAll(/[a-z|%|(|)]/gi, '') * 1 ;
      times.className = 'time-module';
      let style = {
        width: `${wd*hours}%`,
        height: `${hg - data.options.cut}px`,
        position: 'absolute',
        backgroundColor: `${dts[i].backgroundColor}`,
        top: `${(cate * hg) + (borderWidth*cate+borderWidth) + (data.options.cut / 2)}px`,
        left: `${wd*st}%`,
        color: `${dts[i].color?dts[i].color:data.options.color}`,
        textAlign: 'center',
        lineHeight: `${hg - data.options.cut}px`,
        clipPath: data.options.shape ? data.options.shape : '',
        userSelect: 'none',
        cursor:data.options.click?'pointer':'',
        fontSize: `${fontSize}px`,
      };
      times.innerText = note;
      ul.append(times);
      setStyle(style, times);
    }
  }
  const tm = document.querySelectorAll('.time-module');
  data.options.click ? (
    // 콜백함수
    tm.forEach(e=>{
      e.addEventListener('click',()=>{
        data.options.click(ul, e)
      })
    })
  ):'';
}

export {mkTimeline};