import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

async function waitForVehicles() {
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Toyota' })).toBeInTheDocument()
  })
}

function getVehicleRow(model: string) {
  const modelCell = screen.getByText(model)
  const row = modelCell.closest('li')

  if (!row) {
    throw new Error(`Could not find row for ${model}`)
  }

  return within(row)
}

describe('vehicle inventory workflows', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('shows loading feedback before vehicles are ready', async () => {
    render(<App />)

    expect(screen.getByText('Loading vehicles')).toBeInTheDocument()
    await waitForVehicles()
  })

  it('filters vehicles by make and clears the filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitForVehicles()

    await user.click(screen.getByRole('button', { name: 'Jeep' }))

    expect(screen.getByText('Wrangler')).toBeInTheDocument()
    expect(screen.queryByText('Corolla')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getByText('Corolla')).toBeInTheDocument()
    expect(screen.getByText('Wrangler')).toBeInTheDocument()
  })

  it('filters the inventory with the price range slider', async () => {
    render(<App />)
    await waitForVehicles()

    const minimumPriceSlider = screen.getByRole('slider', { name: 'Price min' })
    fireEvent.change(minimumPriceSlider, { target: { value: '30000' } })

    await waitFor(() => {
      expect(screen.getByText('Wrangler')).toBeInTheDocument()
      expect(screen.getByText('X3')).toBeInTheDocument()
      expect(screen.queryByText('A4')).not.toBeInTheDocument()
    })
  })

  it('sorts prices and exposes the current direction', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitForVehicles()

    const sortButton = screen.getByRole('button', {
      name: 'Sort by price, currently ascending',
    })
    await user.click(sortButton)

    expect(
      screen.getByRole('button', { name: 'Sort by price, currently descending' }),
    ).toBeInTheDocument()
  })

  it('edits and saves a vehicle price', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitForVehicles()

    const wranglerRow = getVehicleRow('Wrangler')
    await user.click(wranglerRow.getByRole('button', { name: 'Edit price' }))

    const priceInput = screen.getByRole('spinbutton', {
      name: 'Price for Jeep Wrangler',
    })
    expect(priceInput).toHaveFocus()
    expect(screen.getByText('Editing price')).toBeInTheDocument()

    await user.clear(priceInput)
    await user.type(priceInput, '31000')
    await user.click(screen.getByRole('button', { name: 'Save price' }))

    expect(screen.getByText('$31,000')).toBeInTheDocument()
  })
})