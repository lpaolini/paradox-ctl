import {Area} from './Area.jsx'

const isZoneInArea = (areaDefinition, zoneDefinition) =>
    areaDefinition.id === zoneDefinition.partition

const getAreaEvents = (events, areaName, areaDefinitions, zoneDefinitions) =>
    Object.entries(events)
        .filter(([key]) => {
            const [type, label] = key.split('/')
            return type === 'zone' && isZoneInArea(areaDefinitions[areaName], zoneDefinitions[label])
            || type === 'partition' && areaName === label
        })
        .map(([, zone]) => zone)
        .flat()
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20)

const renderAreas = (areaStates = {}, areaDefinitions = {}, zoneDefinitions = {}, events = {}, exclusions, schedules, updateSchedule, areaCommand) =>
    Object.entries(areaStates).map(([name, area]) => (
        <Area
            key={name}
            state={{name, area}}
            definition={areaDefinitions[name]}
            events={getAreaEvents(events, name, areaDefinitions, zoneDefinitions)}
            exclusions={exclusions}
            schedules={schedules}
            updateSchedule={updateSchedule}
            areaCommand={areaCommand}/>
    ))

export const Areas = ({state, events, exclusions, schedules, updateSchedule, areaCommand}) =>
    renderAreas(state?.states?.partitions, state?.definitions?.partitions, state?.definitions?.zones, events, exclusions, schedules, updateSchedule, areaCommand)
