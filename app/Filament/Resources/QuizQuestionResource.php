<?php

namespace App\Filament\Resources;

use App\Filament\Resources\QuizQuestionResource\Pages;
use App\Filament\Resources\QuizQuestionResource\RelationManagers;
use App\Models\QuizQuestion;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class QuizQuestionResource extends Resource
{
    protected static ?string $model = QuizQuestion::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Manajemen Kuis';
    protected static ?string $modelLabel = 'Soal Kuis';
    protected static ?string $pluralModelLabel = 'Soal Kuis';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Textarea::make('question')
                    ->label('Pertanyaan')
                    ->required()
                    ->maxLength(65535)
                    ->columnSpanFull(),
                Forms\Components\Repeater::make('options')
                    ->label('Pilihan Jawaban')
                    ->simple(Forms\Components\TextInput::make('option')->required())
                    ->minItems(2)
                    ->maxItems(5)
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\Select::make('answer')
                    ->label('Indeks Jawaban Benar (Mulai dari 0)')
                    ->options([
                        0 => 'Pilihan 1 (A)',
                        1 => 'Pilihan 2 (B)',
                        2 => 'Pilihan 3 (C)',
                        3 => 'Pilihan 4 (D)',
                        4 => 'Pilihan 5 (E)',
                    ])
                    ->required(),
                Forms\Components\Toggle::make('is_active')
                    ->label('Aktif (Ditampilkan ke Siswa)')
                    ->default(true)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('question')
                    ->label('Pertanyaan')
                    ->searchable()
                    ->limit(50),
                Tables\Columns\TextColumn::make('answer')
                    ->label('Indeks Jawaban')
                    ->numeric(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Status Aktif')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListQuizQuestions::route('/'),
            'create' => Pages\CreateQuizQuestion::route('/create'),
            'edit' => Pages\EditQuizQuestion::route('/{record}/edit'),
        ];
    }
}
