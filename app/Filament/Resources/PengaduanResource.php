<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PengaduanResource\Pages;
use App\Filament\Resources\PengaduanResource\RelationManagers;
use App\Models\Pengaduan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PengaduanResource extends Resource
{
    protected static ?string $model = Pengaduan::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DatePicker::make('tgl_kejadian')
                    ->required()
                    ->default(now()),
                Forms\Components\Select::make('id_user')
                    ->relationship('user', 'nama_lengkap')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->label('Pelapor'),
                Forms\Components\TextInput::make('judul_laporan')
                    ->required()
                    ->maxLength(150),
                Forms\Components\Select::make('status')
                    ->options([
                        'Pending' => 'Pending',
                        'Proses' => 'Proses',
                        'Ditolak' => 'Ditolak',
                    ])
                    ->required()
                    ->default('Pending'),
                Forms\Components\TextInput::make('poin_diberikan')
                    ->numeric()
                    ->default(0)
                    ->required()
                    ->label('Poin yang Diberikan'),
                Forms\Components\Textarea::make('isi_laporan')
                    ->required()
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id_pengaduan')
                    ->sortable()
                    ->label('ID'),
                Tables\Columns\TextColumn::make('tgl_kejadian')
                    ->date()
                    ->sortable()
                    ->label('Tanggal Kejadian'),
                Tables\Columns\TextColumn::make('user.nama_lengkap')
                    ->searchable()
                    ->sortable()
                    ->label('Pelapor'),
                Tables\Columns\TextColumn::make('judul_laporan')
                    ->searchable()
                    ->limit(50),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Pending' => 'warning',
                        'Proses' => 'info',
                        'Ditolak' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('poin_diberikan')
                    ->numeric()
                    ->sortable()
                    ->label('Poin'),
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
            'index' => Pages\ListPengaduans::route('/'),
            'create' => Pages\CreatePengaduan::route('/create'),
            'edit' => Pages\EditPengaduan::route('/{record}/edit'),
        ];
    }
}
