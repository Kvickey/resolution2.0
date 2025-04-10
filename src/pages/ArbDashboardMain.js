import React from 'react'
import "./ArbDashboardMain.css"
import LineChar from "../components/Linechar";

const ArbDashboardMain = () => {
  return (
    <>
      {/* <h2>ArbDashboard Main Page</h2> */}
      <div className='stats1'>
        <div className="statsItem1">
          <div className="statsTitle1 progress1">  2           
          </div>
          <div className="statsContainer1">Unassigned Lots</div>
        </div>
  
        <div className="statsItem1">
          <div className="statsTitle1 pending1"> 200 </div>
          <div className="statsContainer1">Pending Cases</div>          
        </div>

        <div className="statsItem1">
          <div className="statsTitle1 complete1">500</div>
          <div className="statsContainer1"> Cases Resolved this week </div>          
        </div>
      </div>

      <div>
        <div className='dashboard-content1'>
          <div className='arb-panel1'>
            <div className='arb-header1'>
              <h4>Panel of Arbitrators</h4>
            </div>
            <div className='arb-list1'>
              <div className='list-item1'>
                <p>Mr. Gulabrao W. Awasarmol <span>185</span></p>
              </div>
              <div className='list-item1'>
                <p>Adv. Vasant Narayan Lothey Patil <span>250</span></p>
              </div>
              <div className='list-item1'>
                <p>Adv. Eknath Shivram Budhawat <span>110</span></p>
              </div> 
              <div className='list-item1'>
                <p>Adv. Suresh Shivaji Kasture <span>163</span></p>
              </div>
              <div className='list-item1'>
                <p>Adv. Bhaskar H. More <span>90</span></p>
              </div>
            </div>
          </div>

          <div className='chart-area1'>
            <div className='chart-header1'>
              <h2>Case Tracker</h2>
              <LineChar/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ArbDashboardMain
