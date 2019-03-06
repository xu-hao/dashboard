import React, { useState, useEffect, useContext, useRef } from 'react'
import { StoreContext } from '../../contexts/StoreContext'
import Heading from '../../components/Typography/Heading'
import BrowseMenu from '../../components/Menus/BrowseMenu'
import { Grid, Card, CardHeader, CardContent } from '@material-ui/core'
import ProposalsPieChart from '../../components/Charts/ProposalsPie'
import ProposalsBarChart from '../../components/Charts/ProposalsBar'
import { CircularLoader } from '../../components/Progress/Progress'
import ProposalsTable from '../../components/Charts/ProposalsTable'
import ChartOptions from '../../components/Menus/ChartOptions'

const ProposalsByOrganization = props => {
    const [store, setStore] = useContext(StoreContext)
    const [proposalsByOrganization, setProposalsByOrganization] = useState()
    const [displayedProposals, setDisplayedProposals] = useState()
    const [tableTitle, setTableTitle] = useState('')
    const [chartType, setChartType] = useState('pie')
    const [chartSorting, setChartSorting] = useState('alpha')
    const tableRef = useRef(null)
    
    useEffect(() => {
        if (store.proposals && store.organizations) {
            const orgs = store.organizations.map(({ description }) => ({ name: description, proposals: [] }))
            store.proposals.forEach(proposal => {
                const index = orgs.findIndex(({ name }) => name === proposal.submitterInstitution)
                if (index >= 0) orgs[index].proposals.push(proposal)
            })
            setProposalsByOrganization(orgs)
        }
    }, [store])

    const selectProposals = ({ id }) => {
        const index = proposalsByOrganization.findIndex(org => org.name === id)
        setTableTitle('Submitting Institution: ' + id)
        setDisplayedProposals(proposalsByOrganization[index].proposals)
        scrollToTable()
    }
    
    const handleSelectGraphType = (event, type) => setChartType(type)
    const handleSelectGraphSorting = (event, sorting) => setChartSorting(sorting)

    const scrollToTable = () => {
        setTimeout(() => tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500)
    }

    return (
        <div>
            <Heading>
                Proposals by Submitting Institution
                <BrowseMenu />
            </Heading>

            <Grid container>

                <Grid item xs={ 12 }>
                    <Card>
                        <CardHeader action={
                            <ChartOptions
                                sortingSelectionHandler={ handleSelectGraphSorting } currentSorting={ chartSorting }
                                typeSelectionHandler={ handleSelectGraphType } currentType={ chartType }
                            />
                        } />
                        <CardContent>
                            {
                                proposalsByOrganization && chartType === 'pie'
                                && <ProposalsPieChart proposals={ proposalsByOrganization } clickHandler={ selectProposals } height={ 600 } sorting={ chartSorting } />
                            }
                            {
                                proposalsByOrganization && chartType === 'bar'
                                && <ProposalsBarChart proposals={ proposalsByOrganization } clickHandler={ selectProposals } height={ 700 } sorting={ chartSorting } />
                            }
                            { !proposalsByOrganization && <CircularLoader /> }
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={ 12 }>
                    <div ref={ tableRef }></div>
                    <ProposalsTable title={ tableTitle } proposals={ displayedProposals } paging={ false } />
                </Grid>

            </Grid>

        </div>
    )
}

export default ProposalsByOrganization