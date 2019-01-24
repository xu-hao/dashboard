import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

Array.prototype.countBy = function(prop) {
    return this.reduce(function(groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || 0
        groups[val] += 1
        return groups
    }, {})
}

// * Create endpoint to pull these from the database
const statuses = [
    'Submitted',
    'Pending Submission',
    'Returned to Investigator',
    'Under Review',
    'Approved for Service(s)',
    'Approved for Initial Consultation',
    'Approved for Comprehensive Consultation',
    'Ready for Initial Consultation',
    'Re-Submitted',
    'Pending Re-submission',
    'Comprehensive Complete - Grant Submitted',
    'Ready for NCATS Review',
    'Ready for Implementation',
    'No Further Network Support',
    'Not Approved',
    'Approved for Service(s) Pending Receipt of Funding',
    'On Hold',
    'Service(s) Complete',
    'Approved for Network Support',
    'Withdrawn by PI',
    'Withdrawn by PI post-award',
]

const proposalsGroupedByTicAndStatus = (props) => {
    const { proposals, colors } = props
    const proposalGroups = proposals.map((tic) => {
        return {
            name: tic.name,
            ...tic.proposals.countBy('proposal_status'),
        }
    })
    console.log(proposalGroups)
    return (
        <ResponsiveBar
            data={ proposalGroups }
            keys={ statuses }
            indexBy="name"
            margin={{
                "top": 0,
                "right": 64,
                "bottom": 0,
                "left": 100
            }}
            padding={ 0.05 }
            groupMode="stacked"
            layout="horizontal"
            height={ 600 }
            colors={ colors }
            colorBy="id"
            defs={[
                {
                    "id": "dots",
                    "type": "patternDots",
                    "background": "inherit",
                    "color": "#38bcb2",
                    "size": 4,
                    "padding": 1,
                    "stagger": true
                },
                {
                    "id": "lines",
                    "type": "patternLines",
                    "background": "inherit",
                    "color": "#eed312",
                    "rotation": -45,
                    "lineWidth": 6,
                    "spacing": 10
                }
            ]}
            fill={[
                {
                    "match": {
                        "id": "fries"
                    },
                    "id": "dots"
                },
                {
                    "match": {
                        "id": "sandwich"
                    },
                    "id": "lines"
                }
            ]}
            borderColor="inherit:darker(1.6)"
            axisBottom={ null }
            axisLeft={{
                "tickSize": 5,
                "tickPadding": 5,
                "tickRotation": 0,
                "legend": "",
                "legendPosition": "middle",
                "legendOffset": -40
            }}
            enableGridX={ false }
            enableGridY={ false }
            labelSkipWidth={ 12 }
            labelSkipHeight={ 12 }
            labelTextColor="inherit:darker(1.6)"
            animate={ true }
            motionStiffness={ 90 }
            motionDamping={ 15 }
            legends={[
                {
                    "dataFrom": "keys",
                    "anchor": "top-right",
                    "direction": "column",
                    "justify": false,
                    "translateX": 32,
                    "translateY": 0,
                    "itemsSpacing": 2,
                    "itemWidth": 300,
                    "itemHeight": 20,
                    "itemDirection": "right-to-left",
                    "itemOpacity": 0.85,
                    "symbolSize": 20,
                    "effects": [
                        {
                            "on": "hover",
                            "style": {
                                "itemOpacity": 1
                            }
                        }
                    ]
                }
            ]}
        />
    )
}

export default proposalsGroupedByTicAndStatus