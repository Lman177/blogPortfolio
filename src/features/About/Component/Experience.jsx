import React from 'react'
import style from './style.module.scss'

const timelineData = [
  {
    title: 'Internship at University',
    date: 'April - July 2024',
    description: '',
    side: 'left',
  },
  {
    title: 'Back-end Internship at XYZ',
    date: 'May - March 2024',
    description: '',
    side: 'right',
  },
  {
    title: 'Software Engineer at Company XYZ',
    date: 'Sept - Jan 2024',
    description: '',
    side: 'left',
  },
  {
    title: 'Viettel Digital Talent',
    date: 'Now',
    description: '',
    side: 'right',
  },
];


const Experience = () => {
   

  return (
    <div className={style.experience} >

        <div className={style.divider_container}>
                <hr className={style.divider_line} />
                
        </div>
      <h2 className={style.heading}>Working Experience</h2>
      <div className={style.timeline}>
        <div className={style.verticalLine}></div>
        {timelineData.map((item, index) => (
          <div
          
            key={index}
            className={`${style.timelineItem} ${style[item.side]}`}
          >

            <div className={style.content}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className={style.date}>{item.date}</span>
            </div>

            <span className={style.dot}></span>
          </div>
        ))}
      </div>

    </div >
  )
}

export default Experience
