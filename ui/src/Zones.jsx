import {Zone} from './Zone.jsx'

const getZoneEvents = (events, zoneName) =>
    (events[`zone/${zoneName}`] || [])
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20)

const renderZones = (zoneStates = {}, zoneDefinitions = {}, events = {}, exclusions, updateExclusion) =>
    Object.entries(zoneStates)
        .sort(([a], [b]) => {
            const idA = Number(zoneDefinitions[a].id)
            const idB = Number(zoneDefinitions[b].id)
            return idA > idB ? 1 : -1
        })
        .map(([name, zone]) => (
            <Zone
                key={name}
                state={{name, zone}}
                definition={zoneDefinitions[name]}
                events={getZoneEvents(events, name)}
                exclusions={exclusions}
                updateExclusion={updateExclusion}
                // sendCommand={sendCommand}
            />
        ))
    
export const Zones = ({state, events, exclusions, updateExclusion}) =>
    renderZones(state?.states?.zones, state?.definitions?.zones, events, exclusions, updateExclusion)
