import React, { Fragment, useContext, useState, useEffect, useReducer } from 'react';
import { useTheme } from '@material-ui/styles'
import * as d3 from 'd3';
import Controls from './ProposalsNetworkControls';
import Visualizations from './ProposalsNetworkVisualizations';
import { CircularLoader } from '../Progress/Progress';
import { StoreContext } from '../../contexts/StoreContext';

function createNodeData(data) {
    // Filter any proposals without a TIC
    data = data.filter(d => d.assignToInstitution);

    // Flatten data
    // XXX: Do this in the query instead?
    data = data.reduce((p, c) => {
        const id = c.proposalID;
        const d = p[id];

        if (d) {
            // Update with any non-blank values
            d3.keys(c).forEach(key => {
                if (c[key]) d[key] = c[key];
            });
        }
        else {
            // Start with this version
            p[id] = c;
        }

        return p;
    }, {});

    data = d3.values(data);

    // First get all unique PIs, proposals, and orgs
    const pis = d3.map(),
          proposals = d3.map(),
          orgs = d3.map(),
          tics = d3.map(),
          areas = d3.map(),
          statuses = d3.map();

    data.forEach(d => {
        const proposal = addNode(d, proposals, d.proposalID, "proposal");

        addNode(d, pis, d.piName, "pi", proposal);
        addNode(d, orgs, d.submitterInstitution, "org", proposal);
        addNode(d, tics, d.assignToInstitution, "tic", proposal);
        addNode(d, areas, d.therapeuticArea, "area", proposal);
        addNode(d, statuses, d.proposalStatus, "status", proposal);
    });

    let nodes = pis.values()
        .concat(proposals.values())
        .concat(orgs.values())
        .concat(tics.values())
        .concat(areas.values())
        .concat(statuses.values());

    let nodeTypes = nodes.reduce((p, c) => {
        const type = p[c.type];

        if (!type) p[c.type] = { type: c.type, count: 1 }
        else type.count++;

        return p;
    }, {});

    nodeTypes = d3.values(nodeTypes)
        .sort((a, b) => d3.ascending(a.count, b.count))
        .map(d => d.type);

    nodes = nodes.sort((a, b) => d3.descending(a.proposals.length, b.proposals.length));

    return {
        nodes: nodes,
        nodeTypes: nodeTypes
    };

    function addNode(d, map, id, type, proposal) {
        if (!map.has(id)) {
          // Create node
          const node = {
            type: type,
            id: id
          };

          switch (type) {
              case "proposal":
                  node.name = d.shortTitle;
                  node.budget = d.totalBudget ? d.totalBudget : "NA";
                  node.dateSubmitted = d.dateSubmitted ? d.dateSubmitted : "NA";
                  node.meetingDate = d.meetingDate ? d.meetingDate : "NA";
                  node.duration = d.fundingPeriod ? d.fundingPeriod : "NA";
                  node.status = d.proposalStatus ? d.proposalStatus : "NA";
                  node.protocolStatus = d.protocol_status ? +d.protocol_status : "NA";
                  node.proposals = [node];
                  node.nodes = [];
                  break;

              case "pi":
              case "org":
              case "tic":
              case "area":
              case "status":
                  node.name = id;
                  node.proposals = [proposal];
                  proposal.nodes.push(node);
                  break;

              default:
                  console.log("Invalid type: " + type);
                  return null;
          };

          map.set(id, node);

          return node;
        }
        else {
          if (type === "proposal") return null;

          // Link nodes to proposals
          const node = map.get(id);
          node.proposals.push(proposal);
          proposal.nodes.push(node);

          return node;
        }
    }
}

const ProposalsNetworkContainer = props => {
    const [store, ] = useContext(StoreContext)
    const [proposals, setProposals] = useState([]);
    const [nodeData, setNodeData] = useState({ nodes: [], nodeTypes: [] });
    const [selectedNodes, selectedNodesDispatcher] = useReducer(updateSelectedNodes, []);
    const theme = useTheme();

    useEffect(() => {
        if (store.proposals) {
            setProposals(store.proposals);
            setNodeData(createNodeData(store.proposals));
        }
    }, [store])

    function getProposals(nodes) {
        if (nodes.length === 0) return [];

        let ids = nodes[0].proposals.filter(d => {
            for (let i = 1; i < nodes.length; i++) {
                if (nodes[i].proposals.indexOf(d) === -1) return false;
            }
            return true;
        }).map(d => d.id);

        return proposals.filter(proposal =>
            ids.indexOf(proposal.proposalID) !== -1
        );
    }

    function updateSelectedNodes(selectedNodes, action) {
        let newNodes = [];

        switch (action.type) {
            case 'select':
                newNodes = !action.nodes ? [] :
                    action.nodes.reduce((p, c) => {
                        return p.indexOf(c) === -1 ? p.concat(c) : p;
                    }, selectedNodes);
                break;

            case 'deselect':
                newNodes = selectedNodes.filter(d => action.nodes.indexOf(d) === -1);
                break;

            case 'control':
                const nonTypeNodes = selectedNodes.filter(d => d.type !== action.name);
                const node = nodeData.nodes.reduce((p, c) => {
                  return c.type === action.name && c.name === action.value ? c : p;
                }, null);

                newNodes = node ? nonTypeNodes.concat(node) : nonTypeNodes;

                break;

            default:
        }

        props.onSelectProposals(getProposals(newNodes));

        return newNodes;
    }

    function handleControlChange(name, event) {
        selectedNodesDispatcher({ type: 'control', name: name, value: event.target.value });
    }

    function handleSelectNodes(nodes) {
        selectedNodesDispatcher({ type: 'select', nodes: nodes });
    }

    function handleDeselectNodes(nodes) {
        selectedNodesDispatcher({ type: 'deselect', nodes: nodes });
    }

    return (
        proposals.length > 0 ?
            <Fragment>
                <Controls
                    proposals={ proposals }
                    onChange={ handleControlChange } />
                <Visualizations
                    nodeData={ nodeData }
                    colors={ theme.palette.chartColors }
                    selectedNodes={ selectedNodes }
                    onSelectNodes={ handleSelectNodes }
                    onDeselectNodes={ handleDeselectNodes } />
            </Fragment>
        : <CircularLoader />
    );
}

export default ProposalsNetworkContainer
