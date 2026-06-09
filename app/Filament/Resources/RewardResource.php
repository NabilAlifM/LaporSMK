<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RewardResource\Pages;
use App\Filament\Resources\RewardResource\RelationManagers;
use App\Models\Reward;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RewardResource extends Resource
{
    protected static ?string $model = Reward::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('nama_reward')
                    ->required()
                    ->maxLength(150),
                Forms\Components\TextInput::make('tipe_reward')
                    ->required()
                    ->maxLength(100),
                Forms\Components\TextInput::make('biaya_poin')
                    ->numeric()
                    ->required()
                    ->label('Biaya Poin'),
                Forms\Components\TextInput::make('stok')
                    ->numeric()
                    ->default(0)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable()
                    ->label('ID'),
                Tables\Columns\TextColumn::make('nama_reward')
                    ->searchable()
                    ->sortable()
                    ->label('Nama Reward'),
                Tables\Columns\TextColumn::make('tipe_reward')
                    ->searchable()
                    ->sortable()
                    ->label('Tipe Reward'),
                Tables\Columns\TextColumn::make('biaya_poin')
                    ->numeric()
                    ->sortable()
                    ->label('Biaya Poin'),
                Tables\Columns\TextColumn::make('stok')
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRewards::route('/'),
            'create' => Pages\CreateReward::route('/create'),
            'edit' => Pages\EditReward::route('/{record}/edit'),
        ];
    }
}
