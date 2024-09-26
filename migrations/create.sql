CREATE TABLE Players (
    id UUID PRIMARY KEY,
    nickname VARCHAR(255) UNIQUE NOT NULL,
    gold_amount BIGINT NOT NULL DEFAULT 0 -- Player's gold balance
);

CREATE TABLE Users (
    id UUID PRIMARY KEY,
    impersonate_player UUID REFERENCES Players(id) ON DELETE CASCADE, -- If user is impersonating a player
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table to store unique in-game items
CREATE TABLE Items (
    id UUID PRIMARY KEY,
    item_name VARCHAR(255) UNIQUE NOT NULL
);

-- Table to store player inventory details (items and their quantities)
CREATE TABLE Inventory (
    player_id UUID REFERENCES Players(id) ON DELETE CASCADE,
    item_id UUID REFERENCES Items(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity >= 0),
    PRIMARY KEY (player_id, item_id)
);

-- Table to store Buy/Sell Offers
CREATE TABLE Offers (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES Players(id) ON DELETE CASCADE,
    item_id UUID REFERENCES Items(id) ON DELETE CASCADE,
    offer_type VARCHAR(4) NOT NULL CHECK (offer_type IN ('BUY', 'SELL')),
    price_per_unit BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_value BIGINT GENERATED ALWAYS AS (price_per_unit * quantity) STORED, -- Total value is stored and calculated
    end_date DATE NOT NULL
);

-- Table to track completed transactions (optional, for history purposes)
CREATE TABLE Transactions (
    id UUID PRIMARY KEY,
    buyer_id UUID REFERENCES Players(id),
    seller_id UUID REFERENCES Players(id),
    item_id UUID REFERENCES Items(id),
    quantity INT NOT NULL,
    total_price BIGINT NOT NULL,
    transaction_date TIMESTAMP DEFAULT NOW()
);
